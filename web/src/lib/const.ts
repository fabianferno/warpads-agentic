import {
  baseSepolia,
  arbitrumSepolia,
  flowTestnet,
  mantleSepoliaTestnet,
  avalancheFuji,
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
  // Avalanche Fuji
  43113: {
    warpTokenAddress: "0x9a80BA9B89d289e32D231dd7efa24545A57CC846",
    adspaceAddress: "0xDC39cdC91F63Ee68531E4500d2D5B964B9b9B706",
    adcampaignAddress: "0x9E06409De2B3FdD0233EE2ca68F595FcD8BF1dD4",
    warpadsAddress: "0xFCED24D3CD405DCdC62265846F51328a67142Af3",
    warpTokenDecimals: 18,
    blockExplorerUrl: avalancheFuji.blockExplorers.default.url,
  },
  // Base Sepolia
  84532: {
    warpTokenAddress: "0x14F729862e63c4B4b9a1c6115Db90B6022de80B9",
    adspaceAddress: "0x3817f9e86E537BCf61e36663BA725e5D573d50bF",
    adcampaignAddress: "0x8d6Cb187e6933b06807d5Db58e93c7A3fcB725c0",
    warpadsAddress: "0xE13286840a109A412e67077eE70191740AAA4d18",
    warpTokenDecimals: 18,
    blockExplorerUrl: baseSepolia.blockExplorers.default.url,
  },
  // Arbitrum Sepolia
  421614: {
    warpTokenAddress: "0xAA0122575750fc7437D0de827329637A322bfee1",
    adspaceAddress: "0x9fd03E8B51c7559d4B3Cc633609dB264FBE16825",
    adcampaignAddress: "0xe779738E801Bfd80B33Ce41c0c2b651EBe6A7109",
    warpadsAddress: "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3",
    warpTokenDecimals: 18,
    blockExplorerUrl: arbitrumSepolia.blockExplorers.default.url,
  },
  // Flow Sepolia
  545: {
    warpTokenAddress: "0x4Bac3740e3980731f041983B61C075a2D316e78A",
    adspaceAddress: "0x4Cbb5045BC463ac91D2dDD24AF4639F1D98f32Ef",
    adcampaignAddress: "0xce0f39abbF9e8d42F9c64fF5EC7bfbb919bedE8E",
    warpadsAddress: "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97",
    warpTokenDecimals: 18,
    blockExplorerUrl: flowTestnet.blockExplorers.default.url,
  },
  // Mantle Sepolia Testnet
  5003: {
    warpTokenAddress: "0xB6e462810B59bB9055DC9d9c93F01Ea80Dc4cE6D",
    adspaceAddress: "0xB35867517ce0D65Db253B8b9878cAdE96903607F",
    adcampaignAddress: "0x691Bc3fB9163a4d365F699FDe7BfC66a8D320C60",
    warpadsAddress: "0xFF9334628C538b445785CeC248F00F1395a596A4",
    warpTokenDecimals: 18,
    blockExplorerUrl: mantleSepoliaTestnet.blockExplorers.default.url,
  },
};
