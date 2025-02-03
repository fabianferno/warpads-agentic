import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WarpAdsModule = buildModule("WarpAdsModule", (m) => {
  // Get deployment parameters with defaults
  const warpTokenName = m.getParameter("warpTokenName", "WARP Token");
  const warpTokenSymbol = m.getParameter("warpTokenSymbol", "WARP");
  const adSpaceNFTName = m.getParameter("adSpaceNFTName", "WarpAds Space");
  const adSpaceNFTSymbol = m.getParameter("adSpaceNFTSymbol", "WASPACE");
  const campaignNFTName = m.getParameter("campaignNFTName", "WarpAds Campaign");
  const campaignNFTSymbol = m.getParameter("campaignNFTSymbol", "WACAMP");
  const treasury = m.getParameter("treasury", "");
  const validator = m.getParameter("validator", "");

  // Deploy WarpToken
  const warpToken = m.contract("WarpToken", [warpTokenName, warpTokenSymbol]);

  // Deploy AdSpaceNFT
  const adSpaceNFT = m.contract("AdSpaceNFT", [
    adSpaceNFTName,
    adSpaceNFTSymbol,
  ]);

  // Deploy CampaignNFT
  const campaignNFT = m.contract("CampaignNFT", [
    campaignNFTName,
    campaignNFTSymbol,
  ]);

  // Deploy WarpAdsProtocol
  const warpAds = m.contract("WarpAdsProtocol", [
    warpToken.address,
    adSpaceNFT.address,
    campaignNFT.address,
    validator,
  ]);

  // Return all deployed contract instances
  return {
    warpToken,
    adSpaceNFT,
    campaignNFT,
    warpAds,
  };
});

export default WarpAdsModule;
