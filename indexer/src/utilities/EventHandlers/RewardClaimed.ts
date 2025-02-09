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

  const result = await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
    { id: adSpaceId, chainId: chainId },
    {
      $inc: {
        onchainReward: -Number(BigInt(amount) / BigInt(10 ** 18)),
        reward: -Number(BigInt(amount) / BigInt(10 ** 18)),
      },
    }
  );

  console.log("Result:", result);
};
