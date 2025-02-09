import { Chain, WalletClient, Account } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { WarpAdsABI } from "./WarpAdsABI";

export interface ChainConfig {
  chain: Chain;
  contractAddress: `0x${string}`;
  chainId: number;
}

export class ChainHandler {
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
