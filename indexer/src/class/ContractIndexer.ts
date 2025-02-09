import { Contract, JsonRpcProvider } from "ethers";
import { WarpAdsABI } from "../abi/WarpAds";
import { AdSpaceRegister } from "../utilities/EventHandlers/AdSpaceRegister";
import { AdCampaignCreated } from "../utilities/EventHandlers/AdCampaignCreated";
import { RewardClaimed } from "../utilities/EventHandlers/RewardClaimed";

interface ChainConfig {
  providerUrl: string;
  contractAddress: string;
  chainId: number;
}

export class ContractIndexer {
  private contract: Contract;
  private chainId: number;

  constructor(config: ChainConfig) {
    const provider = new JsonRpcProvider(config.providerUrl);
    this.contract = new Contract(config.contractAddress, WarpAdsABI, provider);
    this.chainId = config.chainId;
  }

  public async startListening(): Promise<void> {
    try {
      this.contract.on(
        "AdSpaceRegistered",
        async (adSpaceId, owner, warpStake, metadataURI, ...args) => {
          console.log("AdSpace Registered:");
          console.log("ID:", adSpaceId);
          console.log("Owner:", owner);
          console.log("Metadata URI:", metadataURI);
          console.log("Warp Stake:", warpStake);
          console.log("Additional args:", args);

          await AdSpaceRegister(
            adSpaceId,
            owner,
            metadataURI,
            warpStake,
            this.chainId
          );
          console.log("Listening for AdSpaceRegistered events...");
        }
      );

      this.contract.on(
        "CampaignRegistered",
        async (
          campaignId,
          owner,
          expiry,
          priorityStake,
          adContent,
          ...args
        ) => {
          console.log("AdCampaign Created:");
          console.log("ID:", campaignId);
          console.log("Owner:", owner);
          console.log("Ad Content:", adContent);
          console.log("Priority Stake:", priorityStake);
          console.log("Expiry:", expiry);
          console.log("Additional args:", args);

          await AdCampaignCreated(
            campaignId,
            owner,
            adContent,
            priorityStake,
            expiry,
            this.chainId
          );
          console.log("Listening for AdCampaignCreated events...");
        }
      );

      this.contract.on(
        "RewardsClaimed",
        async (adSpaceId, user, amount, ...args) => {
          console.log("Rewards Claimed:");
          console.log("Ad Space ID:", adSpaceId);
          console.log("User:", user);
          console.log("Amount:", amount);
          console.log("Additional args:", args);
          await RewardClaimed(adSpaceId, this.chainId, user, amount);
        }
      );
    } catch (error) {
      console.error(
        `Error setting up event listener for chain ${this.chainId}:`,
        error
      );
    }
  }
}
