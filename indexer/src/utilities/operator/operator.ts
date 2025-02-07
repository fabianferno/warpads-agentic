import { createWalletClient, http } from "viem";
import { client } from "../../config/db";
import { env } from "../../config/env";
import { privateKeyToAccount } from "viem/accounts";
import {
  baseSepolia,
  arbitrumSepolia,
  seiDevnet,
  modeTestnet,
} from "viem/chains";
import { WarpAdsABI } from "../../abi/WarpAds";
import connectDB from "../../config/db";

export const operator = async () => {
  // Iterate through the id , get the reward and update onChain.
  console.log("Operator started");
  await connectDB();
  const db = client.db();

  const BASE_CONTRACT_ADDRESS = "0x1ebd3946e37519b2b60809c0621f56212121dfc7";
  const ARBITRUM_CONTRACT_ADDRESS =
    "0x00fF72F211f714CaF9C3E7C68f03E706f9AbD3d2";
  const SEI_CONTRACT_ADDRESS = "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78";
  const MODE_CONTRACT_ADDRESS = "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78";

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

  // Sei Devnet
  const seiDevnetWalletClient = createWalletClient({
    chain: seiDevnet,
    account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
    transport: http(),
  });

  // Mode testnet
  const modeTestnetWalletClient = createWalletClient({
    chain: modeTestnet,
    account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
    transport: http(),
  });

  const adSpaces = await db
    .collection("adSpaces")
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
    seiDevnet: {
      ids: [] as number[],
      rewards: [] as number[],
    },
    modeTestnet: {
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
    } else if (adSpace.chainId === 713715) {
      rewardsByChain.seiDevnet.ids.push(adSpace.id);
      rewardsByChain.seiDevnet.rewards.push(remainingReward * 10 ** 18);
    } else if (adSpace.chainId === 919) {
      rewardsByChain.modeTestnet.ids.push(adSpace.id);
      rewardsByChain.modeTestnet.rewards.push(remainingReward * 10 ** 18);
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
      await db.collection("adSpaces").updateOne(
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
      await db.collection("adSpaces").updateOne(
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

  if (rewardsByChain.seiDevnet.ids.length > 0) {
    await seiDevnetWalletClient.writeContract({
      address: SEI_CONTRACT_ADDRESS,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [rewardsByChain.seiDevnet.ids, rewardsByChain.seiDevnet.rewards],
    });

    for (let i = 0; i < rewardsByChain.seiDevnet.ids.length; i++) {
      await db.collection("adSpaces").updateOne(
        { id: rewardsByChain.seiDevnet.ids[i] },
        {
          $set: {
            onchainReward: rewardsByChain.seiDevnet.rewards[i] / 10 ** 18,
          },
        }
      );
    }

    console.log("Sei Devnet Rewards Updated");
  }

  if (rewardsByChain.modeTestnet.ids.length > 0) {
    await modeTestnetWalletClient.writeContract({
      address: MODE_CONTRACT_ADDRESS,
      abi: WarpAdsABI,
      functionName: "setBatchClaimableRewards",
      args: [
        rewardsByChain.modeTestnet.ids,
        rewardsByChain.modeTestnet.rewards,
      ],
    });

    for (let i = 0; i < rewardsByChain.modeTestnet.ids.length; i++) {
      await db.collection("adSpaces").updateOne(
        { id: rewardsByChain.modeTestnet.ids[i] },
        {
          $set: {
            onchainReward: rewardsByChain.modeTestnet.rewards[i] / 10 ** 18,
          },
        }
      );
    }
    console.log("Mode Testnet Rewards Updated");
  }
};
