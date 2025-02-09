import {
  createWalletClient,
  http,
  Chain,
  WalletClient,
  WriteContractParameters,
  Account,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, arbitrumSepolia, flowTestnet } from "viem/chains";
import { WarpAdsABI } from "../utils/WarpAdsABI";
import connectDB, { client } from "./db";

interface ChainConfig {
  chain: Chain;
  contractAddress: `0x${string}`;
  chainId: number;
}

class ChainHandler {
  private walletClient: WalletClient;
  private contractAddress: `0x${string}`;
  private chainId: number;
  private db: any;
  private chain: Chain;
  private account: Account;

  constructor(config: ChainConfig, privateKey: string, db: any) {
    this.chain = config.chain;
    this.account = privateKeyToAccount(privateKey as `0x${string}`);
    this.walletClient = createWalletClient({
      chain: config.chain,
      account: this.account,
      transport: http(),
    });
    this.contractAddress = config.contractAddress;
    this.chainId = config.chainId;
    this.db = db;
  }

  async updateRewards(ids: number[], rewards: number[]) {
    if (ids.length === 0) return;

    console.log(`Updating ${this?.walletClient?.chain?.name} Rewards`);
    console.log("IDs:", ids);
    console.log("Rewards:", rewards);

    const writeParams = {
      account: this.account,
      chain: this.chain,
      address: this.contractAddress,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [ids, rewards],
    } as const;

    await this.walletClient.writeContract(writeParams);

    // Update the onchainReward in the database
    for (let i = 0; i < ids.length; i++) {
      await this.db
        .collection(`${process.env.NODE_ENV || "development"}_adSpaces`)
        .updateOne(
          { id: ids[i] },
          {
            $set: {
              onchainReward: rewards[i] / 10 ** 18,
            },
          }
        );
    }

    console.log(`${this?.walletClient?.chain?.name} Rewards Updated`);
  }
}

export const operator = async () => {
  console.log("Operator started");
  await connectDB();
  const db = client.db();

  const chainConfigs: ChainConfig[] = [
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

  const chainHandlers = chainConfigs.map(
    (config) =>
      new ChainHandler(config, process.env.OPERATOR_PRIVATE_KEY as string, db)
  );

  const adSpaces = await db
    .collection(`${process.env.NODE_ENV || "development"}_adSpaces`)
    .find({
      $expr: {
        $and: [{ $gt: ["$reward", 0] }, { $lt: ["$onchainReward", "$reward"] }],
      },
    })
    .toArray();

  console.log("AdSpaces found:", adSpaces.length);

  // Group rewards by chain
  const rewardsByChain = chainConfigs.reduce((acc, config) => {
    acc[config.chainId] = {
      ids: [] as number[],
      rewards: [] as number[],
    };
    return acc;
  }, {} as Record<number, { ids: number[]; rewards: number[] }>);

  // Distribute rewards to respective chains
  for (const adSpace of adSpaces) {
    const remainingReward = adSpace.reward - (adSpace.onchainReward || 0);
    if (rewardsByChain[adSpace.chainId]) {
      rewardsByChain[adSpace.chainId].ids.push(adSpace.id);
      rewardsByChain[adSpace.chainId].rewards.push(remainingReward * 10 ** 18);
    }
  }

  // Update rewards for each chain
  for (let i = 0; i < chainConfigs.length; i++) {
    const config = chainConfigs[i];
    const chainData = rewardsByChain[config.chainId];
    await chainHandlers[i].updateRewards(chainData.ids, chainData.rewards);
  }
};
