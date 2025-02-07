import { client } from "../../config/db";

export const RewardClaimed = async (
  adSpaceId: number,
  user: string,
  amount: number
) => {
  console.log("Rewards Claimed:", adSpaceId, user, amount);

  const db = client.db();

  const result = await db.collection("adSpaces").updateOne(
    { adSpaceId },
    {
      $inc: {
        onchainReward: -Number(BigInt(amount) / BigInt(10 ** 18)),
        reward: -Number(BigInt(amount) / BigInt(10 ** 18)),
      },
    }
  );

  console.log("Result:", result);
};
