import { ChainConfig } from "./ChainHandler";
import { baseSepolia, arbitrumSepolia, flowTestnet } from "viem/chains";

export const chainConfigs: ChainConfig[] = [
  {
    chain: baseSepolia,
    contractAddress: "0xE13286840a109A412e67077eE70191740AAA4d18",
    chainId: 84532,
  },
  {
    chain: arbitrumSepolia,
    contractAddress: "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3",
    chainId: 421614,
  },
  {
    chain: flowTestnet,
    contractAddress: "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97",
    chainId: 545,
  },
];
