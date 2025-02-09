import { client } from "../../config/db";
import { env } from "../../config/env";

export const RewardClaimed = async (
  adSpaceId: number,
  chainId: number,
  user: string,
  amount: number
) => {
  console.log("Rewards Claimed:", adSpaceId, user, amount);

  const db = client.db();

  const adSpace = await db.collection(`${env.NODE_ENV}_adSpaces`).findOne({
    id: adSpaceId,
    chainId: chainId,
  });

  if (!adSpace) {
    throw new Error("AdSpace not found");
  }

  const decrementAmount = Number(BigInt(amount) / BigInt(10 ** 18));

  const result = await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
    { id: adSpaceId, chainId: chainId },
    {
      $set: {
        onchainReward: adSpace.onchainReward - decrementAmount,
        reward: adSpace.reward - decrementAmount,
      },
    }
  );

  console.log("Result:", result);
};
