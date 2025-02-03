import { ethers } from "hardhat";
import { run } from "hardhat";

async function main() {
  console.log("Starting deployment sequence...");

  // 1. Deploy WarpToken
  console.log("\nDeploying WarpToken...");
  const WarpToken = await ethers.getContractFactory("WarpToken");
  const warpToken = await WarpToken.deploy("WarpToken", "WARP");
  await warpToken.waitForDeployment();
  const warpTokenAddress = await warpToken.getAddress();
  console.log("WarpToken deployed to:", warpTokenAddress);

  // 2. Deploy Adspace
  console.log("\nDeploying Adspace...");
  const Adspace = await ethers.getContractFactory("AdSpaceNFT");
  const adspace = await Adspace.deploy("AdSpace", "ADSPACE");
  await adspace.waitForDeployment();
  const adspaceAddress = await adspace.getAddress();
  console.log("Adspace deployed to:", adspaceAddress);

  // 3. Deploy AdCampaign
  console.log("\nDeploying AdCampaign...");
  const AdCampaign = await ethers.getContractFactory("CampaignNFT");
  const adCampaign = await AdCampaign.deploy("AdCampaign", "ADCAMPAIGN");
  await adCampaign.waitForDeployment();
  const adCampaignAddress = await adCampaign.getAddress();
  console.log("AdCampaign deployed to:", adCampaignAddress);

  // 4. Deploy WarpAdsProtocol
  console.log("\nDeploying WarpAds contract...");
  const WarpAds = await ethers.getContractFactory("WarpAdsProtocol");
  const warpAds = await WarpAds.deploy(
    "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
    warpTokenAddress,
    adspaceAddress,
    adCampaignAddress,
    "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334"
  );
  await warpAds.waitForDeployment();
  const warpAdsAddress = await warpAds.getAddress();
  console.log("WarpAds deployed to:", warpAdsAddress);

  // 5. Transfer ownership of Adspace and AdCampaign to WarpAds
  console.log(
    "\nTransferring ownership of Adspace and AdCampaign to WarpAds..."
  );
  await adspace.transferOwnership(warpAdsAddress);
  console.log("Adspace ownership transferred to WarpAds");
  await adCampaign.transferOwnership(warpAdsAddress);
  console.log("AdCampaign ownership transferred to WarpAds");

  // 6. I want to verify all the 4 contracts.
  console.log("\nVerifying contracts...");
  try {
    await run("verify:verify", {
      address: warpTokenAddress,
      constructorArguments: ["WarpToken", "WARP"],
    });
    console.log("WarpToken verified");
  } catch (error) {
    console.error("Error verifying WarpToken:", error);
  }

  try {
    await run("verify:verify", {
      address: adspaceAddress,
      constructorArguments: ["AdSpace", "ADSPACE"],
    });
    console.log("Adspace verified");
  } catch (error) {
    console.error("Error verifying Adspace:", error);
  }

  try {
    await run("verify:verify", {
      address: adCampaignAddress,
      constructorArguments: ["AdCampaign", "ADCAMPAIGN"],
    });
    console.log("AdCampaign verified");
  } catch (error) {
    console.error("Error verifying AdCampaign:", error);
  }

  try {
    await run("verify:verify", {
      address: warpAdsAddress,
      constructorArguments: [
        "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
        warpTokenAddress,
        adspaceAddress,
        adCampaignAddress,
        "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
      ],
    });
    console.log("WarpAds verified");
  } catch (error) {
    console.error("Error verifying WarpAds:", error);
  }

  console.log("\nDeployment sequence completed successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
