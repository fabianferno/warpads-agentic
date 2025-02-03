import { ethers } from "hardhat";

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
    warpTokenAddress,
    adspaceAddress,
    adCampaignAddress
  );
  await warpAds.waitForDeployment();
  const warpAdsAddress = await warpAds.getAddress();
  console.log("WarpAds deployed to:", warpAdsAddress);

  // // Transfer ownership of Adspace and AdCampaign to WarpAds
  // await adspace.(warpAdsAddress);
  // console.log("Adspace ownership transferred to WarpAds");
  // await adCampaign.transferOwnership(warpAdsAddress);
  // console.log("AdCampaign ownership transferred to WarpAds");

  // Get the AdNFT address
  // const adNFTAddress = await warpAds.adNFT();
  // console.log("AdNFT deployed to:", adNFTAddress);

  console.log("\nVerification commands:");
  console.log(`npx hardhat verify --network base-sepolia ${warpTokenAddress}`);
  console.log(`npx hardhat verify --network base-sepolia ${adspaceAddress}`);
  console.log(`npx hardhat verify --network base-sepolia ${adCampaignAddress}`);
  console.log(
    `npx hardhat verify --network base-sepolia ${warpAdsAddress} ${warpTokenAddress} ${adspaceAddress} ${adCampaignAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
