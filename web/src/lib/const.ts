import {
  baseSepolia,
  arbitrumSepolia,
  modeTestnet,
  seiDevnet,
} from "viem/chains";

export const contractsConfig: {
  [key: number]: {
    warpTokenAddress: `0x${string}`;
    adspaceAddress: `0x${string}`;
    adcampaignAddress: `0x${string}`;
    warpadsAddress: `0x${string}`;
    warpTokenDecimals: number;
    blockExplorerUrl: string;
  };
} = {
  // Base Sepolia
  84532: {
    warpTokenAddress: "0xC76162e6e38D57086c0D03d5949D893fBDf9C03E",
    adspaceAddress: "0x99E06E450F71bb54Fa5410393A361cDcb7789978",
    adcampaignAddress: "0x79A124D200eDefba9836d988350c354387A7CD89",
    warpadsAddress: "0x1EBD3946E37519B2b60809c0621F56212121DfC7",
    warpTokenDecimals: 18,
    blockExplorerUrl: baseSepolia.blockExplorers.default.url,
  },
  // Arbitrum Sepolia
  421614: {
    warpTokenAddress: "0xFCED24D3CD405DCdC62265846F51328a67142Af3",
    adspaceAddress: "0x8B386Edef0750FFFA8d15e514992E919e21dc828",
    adcampaignAddress: "0xb830f7702a262AbDcaDA58fc760a9D313587aF30",
    warpadsAddress: "0x327083bdc79F84d3B54970f23bf3AD61802c2A12",
    warpTokenDecimals: 18,
    blockExplorerUrl: arbitrumSepolia.blockExplorers.default.url,
  },
  // Mode Testnet
  919: {
    warpTokenAddress: "0x93316EbF65Bd209b3832a6d383d53905A97f9D90",
    adspaceAddress: "0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB",
    adcampaignAddress: "0x0DAbc440052ED94FfE69de2D704b1F151bF12c16",
    warpadsAddress: "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78",
    warpTokenDecimals: 18,
    blockExplorerUrl: modeTestnet.blockExplorers.default.url,
  },
  // Sei testnet
  713715: {
    warpTokenAddress: "0x93316EbF65Bd209b3832a6d383d53905A97f9D90",
    adspaceAddress: "0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB",
    adcampaignAddress: "0x0DAbc440052ED94FfE69de2D704b1F151bF12c16",
    warpadsAddress: "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78",
    warpTokenDecimals: 18,
    blockExplorerUrl: seiDevnet.blockExplorers.default.url,
  },
};
