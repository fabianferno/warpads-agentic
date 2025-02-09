import { createWalletClient, http } from "viem";
import { client } from "../../config/db";
import { env } from "../../config/env";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, arbitrumSepolia, flowTestnet } from "viem/chains";
import { WarpAdsABI } from "../../abi/WarpAds";
import connectDB from "../../config/db";

export const operator = async () => {
  // Iterate through the id , get the reward and update onChain.
  console.log("Operator started");
  await connectDB();
  const db = client.db();

  const BASE_CONTRACT_ADDRESS = "0xE13286840a109A412e67077eE70191740AAA4d18";
  const ARBITRUM_CONTRACT_ADDRESS =
    "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3";
  const FLOW_CONTRACT_ADDRESS = "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97";

  // Create a client for the onchain
  const baseSepoliaWalletClient = createWalletClient({
    chain: baseSepolia,
    account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
    transport: http(),
  });

  // Arb
  const arbSepoliaWalletClient = createWalletClient({
    chain: arbitrumSepolia,
    account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
    transport: http(),
  });

  // Flow Testnet
  const flowTestnetWalletClient = createWalletClient({
    chain: flowTestnet,
    account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
    transport: http(),
  });

  const adSpaces = await db
    .collection(`${env.NODE_ENV}_adSpaces`)
    .find({
      $expr: {
        $and: [{ $gt: ["$reward", 0] }, { $lt: ["$onchainReward", "$reward"] }],
      },
    })
    .toArray();

  console.log("AdSpaces found:", adSpaces.length);

  // Group by chain
  const rewardsByChain = {
    baseSepolia: {
      ids: [] as number[],
      rewards: [] as number[],
    },
    arbitrumSepolia: {
      ids: [] as number[],
      rewards: [] as number[],
    },
    flowTestnet: {
      ids: [] as number[],
      rewards: [] as number[],
    },
  };

  for (const adSpace of adSpaces) {
    // Calculate remaining reward to be updated onchain
    const remainingReward = adSpace.reward - (adSpace.onchainReward || 0);

    // Add to appropriate chain array
    if (adSpace.chainId === 84532) {
      rewardsByChain.baseSepolia.ids.push(adSpace.id);
      rewardsByChain.baseSepolia.rewards.push(remainingReward * 10 ** 18);
    } else if (adSpace.chainId === 421614) {
      rewardsByChain.arbitrumSepolia.ids.push(adSpace.id);
      rewardsByChain.arbitrumSepolia.rewards.push(remainingReward * 10 ** 18);
    } else if (adSpace.chainId === 545) {
      rewardsByChain.flowTestnet.ids.push(adSpace.id);
      rewardsByChain.flowTestnet.rewards.push(remainingReward * 10 ** 18);
    }
  }

  if (rewardsByChain.baseSepolia.ids.length > 0) {
    console.log("Updating Base Sepolia Rewards");
    console.log(rewardsByChain.baseSepolia.ids);
    console.log(rewardsByChain.baseSepolia.rewards);
    await baseSepoliaWalletClient.writeContract({
      address: BASE_CONTRACT_ADDRESS,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [
        rewardsByChain.baseSepolia.ids,
        rewardsByChain.baseSepolia.rewards,
      ],
    });

    // Update the onchainReward in the database
    for (let i = 0; i < rewardsByChain.baseSepolia.ids.length; i++) {
      await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
        { id: rewardsByChain.baseSepolia.ids[i] },
        {
          $set: {
            onchainReward: rewardsByChain.baseSepolia.rewards[i] / 10 ** 18,
          },
        }
      );
    }

    console.log("Base Sepolia Rewards Updated");
  }

  if (rewardsByChain.arbitrumSepolia.ids.length > 0) {
    await arbSepoliaWalletClient.writeContract({
      address: ARBITRUM_CONTRACT_ADDRESS,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [
        rewardsByChain.arbitrumSepolia.ids,
        rewardsByChain.arbitrumSepolia.rewards,
      ],
    });

    for (let i = 0; i < rewardsByChain.arbitrumSepolia.ids.length; i++) {
      await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
        { id: rewardsByChain.arbitrumSepolia.ids[i] },
        {
          $set: {
            onchainReward: rewardsByChain.arbitrumSepolia.rewards[i] / 10 ** 18,
          },
        }
      );
    }

    console.log("Arbitrum Sepolia Rewards Updated");
  }

  if (rewardsByChain.flowTestnet.ids.length > 0) {
    await flowTestnetWalletClient.writeContract({
      address: FLOW_CONTRACT_ADDRESS,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [
        rewardsByChain.flowTestnet.ids,
        rewardsByChain.flowTestnet.rewards,
      ],
    });

    for (let i = 0; i < rewardsByChain.flowTestnet.ids.length; i++) {
      await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
        { id: rewardsByChain.flowTestnet.ids[i] },
        {
          $set: {
            onchainReward: rewardsByChain.flowTestnet.rewards[i] / 10 ** 18,
          },
        }
      );
    }

    console.log("Flow Testnet Rewards Updated");
  }
};
