import { ethers } from "hardhat";

async function main() {
  const warpsToken = await ethers.getContractAt(
    "WarpToken",
    "0x923f68e4A026B4c9ead5b43DfFC468c3BC52c045"
  );
  const warpAds = await ethers.getContractAt(
    "WarpAdsProtocol",
    "0x070C0B63AbC6604f84E062E1C648b85a5ae4A4Ad"
  );

  await warpsToken.mint(
    "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
    BigInt(2e18)
  );
  await warpsToken.approve(
    "0x070C0B63AbC6604f84E062E1C648b85a5ae4A4Ad",
    BigInt(1e18)
  );
  const metadataURI = JSON.stringify({
    name: "DeFi Alpha Bot",
    description:
      "Prime ad space within a DeFi trading bot with 50K daily active degens",
    keywords: ["DeFi", "staking", "airdrops", "NFTs"],
    image: "https://example.com/adspace-image.png",
    account_id: "defiGuru",
    account_type: "twitter",
  });
  try {
    // await warpAds.registerAgent(metadataURI, BigInt(1e18), {
    //   gasLimit: 1000000,
    // });
    console.log("Registered agent");
  } catch (error) {
    console.log(error);
  }
}

main().catch((error) => {
  console.error("Error creating ad space:", error);
  process.exit(1);
});
