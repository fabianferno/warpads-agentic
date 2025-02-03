import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  WarpAdsProtocol,
  AdSpaceNFT,
  CampaignNFT,
  WarpToken,
} from "../typechain-types";
import { parseEther } from "ethers";
import { EventLog } from "ethers";

describe("WarpAds E2E", function () {
  let warpAds: WarpAdsProtocol;
  let adSpaceNFT: AdSpaceNFT;
  let campaignNFT: CampaignNFT;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let advertiser: SignerWithAddress;
  let oracle: SignerWithAddress;
  let publisher: SignerWithAddress;
  let warpToken: WarpToken;

  beforeEach(async function () {
    // Get signers
    [owner, treasury, advertiser, oracle, publisher] =
      await ethers.getSigners();

    // Deploy WarpToken
    const WarpToken = await ethers.getContractFactory("WarpToken");
    warpToken = await WarpToken.deploy("WARP", "WARP");
    await warpToken.waitForDeployment();

    // Deploy AdSpaceNFT
    const AdSpaceNFT = await ethers.getContractFactory("AdSpaceNFT");
    adSpaceNFT = await AdSpaceNFT.deploy("WarpAds Space", "WASPACE");
    await adSpaceNFT.waitForDeployment();

    // Deploy CampaignNFT
    const CampaignNFT = await ethers.getContractFactory("CampaignNFT");
    campaignNFT = await CampaignNFT.deploy("WarpAds Campaign", "WACAMP");
    await campaignNFT.waitForDeployment();

    // Deploy WarpAds
    const WarpAds = await ethers.getContractFactory("WarpAdsProtocol");
    warpAds = await WarpAds.deploy(
      await treasury.getAddress(),
      await warpToken.getAddress(),
      await adSpaceNFT.getAddress(),
      await campaignNFT.getAddress(),
      await oracle.getAddress()
    );
    await warpAds.waitForDeployment();

    // Transfer ownership of NFT contracts to WarpAds
    await adSpaceNFT.transferOwnership(await warpAds.getAddress());
    await campaignNFT.transferOwnership(await warpAds.getAddress());

    // Fund advertiser with WARP tokens
    await warpToken.mint(await advertiser.getAddress(), parseEther("1000"));
    await warpToken
      .connect(advertiser)
      .approve(await warpAds.getAddress(), parseEther("1000"));

    // Fund publisher with WARP tokens
    await warpToken.mint(await publisher.getAddress(), parseEther("1000"));
    await warpToken
      .connect(publisher)
      .approve(await warpAds.getAddress(), parseEther("1000"));
  });

  describe("E2E Flow", function () {
    it("Should execute a complete ad campaign lifecycle", async function () {
      // 1. Create an ad space by publisher
      const contextHash = ethers.solidityPackedKeccak256(
        ["string"],
        ["test context"]
      );
      const minStake = parseEther("100");
      const tx1 = await warpAds
        .connect(publisher)
        .registerAgent("ipfs://test-metadata", minStake);
      const receipt1 = await tx1.wait();
      if (!receipt1) throw new Error("Transaction failed");
      const event1 = receipt1.logs.find(
        (log) =>
          log instanceof EventLog && log.eventName === "AdSpaceRegistered"
      ) as EventLog;
      if (!event1) throw new Error("Event not found");
      const publisherTokenId = event1.args[0];

      // Verify ad space creation
      const adSpace = await warpAds.adSpaces(publisherTokenId);
      expect(await adSpaceNFT.ownerOf(publisherTokenId)).to.equal(
        await publisher.getAddress()
      );
      expect(adSpace.stakedWarp).to.equal(minStake);

      // 2. Create advertiser's ad space
      const stakeAmount = parseEther("200");
      const tx2 = await warpAds
        .connect(advertiser)
        .registerAgent("ipfs://test-metadata-advertiser", stakeAmount);
      const receipt2 = await tx2.wait();
      if (!receipt2) throw new Error("Transaction failed");
      const event2 = receipt2.logs.find(
        (log) =>
          log instanceof EventLog && log.eventName === "AdSpaceRegistered"
      ) as EventLog;
      if (!event2) throw new Error("Event not found");
      const advertiserTokenId = event2.args[0];

      // Verify advertiser's ad space
      const advertiserAdSpace = await warpAds.adSpaces(advertiserTokenId);
      expect(await adSpaceNFT.ownerOf(advertiserTokenId)).to.equal(
        await advertiser.getAddress()
      );
      expect(advertiserAdSpace.stakedWarp).to.equal(stakeAmount);

      // 3. Launch campaign
      const durationDays = 7;
      const priorityStake = parseEther("100");
      const adContent = "ipfs://test-uri";

      const campaignTx = await warpAds
        .connect(advertiser)
        .registerCampaign(durationDays, priorityStake, adContent);
      const campaignReceipt = await campaignTx.wait();
      if (!campaignReceipt) throw new Error("Transaction failed");
      const campaignEvent = campaignReceipt.logs.find(
        (log) =>
          log instanceof EventLog && log.eventName === "CampaignRegistered"
      ) as EventLog;
      if (!campaignEvent) throw new Error("Event not found");
      const campaignId = campaignEvent.args[0];

      // 4. Verify campaign state
      expect(await campaignNFT.ownerOf(campaignId)).to.equal(
        await advertiser.getAddress()
      );
      const campaign = await warpAds.campaigns(campaignId);
      expect(campaign.owner).to.equal(await advertiser.getAddress());
      expect(campaign.priorityStake).to.equal(priorityStake);

      // 5. Fast forward time
      await ethers.provider.send("evm_increaseTime", [
        durationDays * 24 * 60 * 60 + 1,
      ]);
      await ethers.provider.send("evm_mine", []);

      // 6. Verify campaign is expired
      expect(await warpAds.isCampaignExpired(campaignId)).to.be.true;

      // 7. Verify publisher earnings
      const adSpaceAfter = await warpAds.adSpaces(publisherTokenId);
      expect(adSpaceAfter.rewardsAccumulated).to.be.gt(0);
    });

    it("Should handle multiple concurrent ad spaces and campaigns", async function () {
      // Create multiple ad spaces
      const tokenIds = [];
      for (let i = 0; i < 3; i++) {
        const contextHash = ethers.solidityPackedKeccak256(
          ["string"],
          [`test context ${i}`]
        );
        const minStake = parseEther((50 + i * 50).toString()); // Different min stakes
        const tx = await warpAds
          .connect(publisher)
          .registerAgent(`ipfs://test-metadata-${i}`, minStake);
        const receipt = await tx.wait();
        if (!receipt) throw new Error("Transaction failed");
        const event = receipt.logs.find(
          (log) =>
            log instanceof EventLog && log.eventName === "AdSpaceRegistered"
        ) as EventLog;
        if (!event) throw new Error("Event not found");
        const tokenId = event.args[0];
        tokenIds.push(tokenId);

        // Verify each ad space immediately after creation
        const adSpace = await warpAds.adSpaces(tokenId);
        expect(await adSpaceNFT.ownerOf(tokenId)).to.equal(
          await publisher.getAddress()
        );
      }

      // Create advertiser's ad space
      const stakeAmount = parseEther("500");
      const tx = await warpAds
        .connect(advertiser)
        .registerAgent("ipfs://test-metadata-advertiser", stakeAmount);
      const receipt = await tx.wait();
      if (!receipt) throw new Error("Transaction failed");
      const event = receipt.logs.find(
        (log) =>
          log instanceof EventLog && log.eventName === "AdSpaceRegistered"
      ) as EventLog;
      if (!event) throw new Error("Event not found");
      const advertiserTokenId = event.args[0];

      // Verify advertiser's ad space
      const advertiserAdSpace = await warpAds.adSpaces(advertiserTokenId);
      expect(await adSpaceNFT.ownerOf(advertiserTokenId)).to.equal(
        await advertiser.getAddress()
      );

      // Launch campaigns for each ad space
      for (let i = 0; i < 3; i++) {
        const campaignTx = await warpAds
          .connect(advertiser)
          .registerCampaign(1, parseEther("50"), `ipfs://test-uri-${i}`);
        const receipt = await campaignTx.wait();
        if (!receipt) throw new Error("Transaction failed");
        const event = receipt.logs.find(
          (log) =>
            log instanceof EventLog && log.eventName === "CampaignRegistered"
        ) as EventLog;
        if (!event) throw new Error("Event not found");
        const campaignId = event.args[0];

        // Verify campaign ownership
        expect(await campaignNFT.ownerOf(campaignId)).to.equal(
          await advertiser.getAddress()
        );
        const campaign = await warpAds.campaigns(campaignId);
        expect(campaign.owner).to.equal(await advertiser.getAddress());
      }
    });
  });

  describe("Oracle Management", function () {
    it("Should properly manage oracle permissions", async function () {
      const newOracle = await ethers.provider.getSigner(5);

      // Add new oracle
      await warpAds.setValidator(await newOracle.getAddress());
      expect(await warpAds.validator()).to.equal(await newOracle.getAddress());
    });

    it("Should reject unauthorized validator actions", async function () {
      const notValidator = await ethers.provider.getSigner(5);

      // Try to terminate a campaign as non-validator
      await expect(
        warpAds.connect(notValidator).terminateCampaign(0)
      ).to.be.revertedWith("Only validator can call");
    });
  });
});
