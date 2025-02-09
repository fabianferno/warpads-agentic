import connectDB, { client } from "../../config/db";
import { env } from "../../config/env";
import { operator } from "./operator";

export const AVSOperatorScript = async () => {
  try {
    await connectDB();
    const db = client.db();
    console.log("Starting AVS Operator Script");

    const validatingResponse = await db
      .collection(`${env.NODE_ENV}_validatedLogs`)
      .find({
        verified: false,
      })
      .toArray();
    console.log(`Found ${validatingResponse.length} unverified validations`);

    for (const validation of validatingResponse) {
      console.log(`Processing validation for taskId: ${validation.taskId}`);
      let twitterRewards = 0;

      // Calculate the twitter rewards
      twitterRewards =
        validation.analytics.views * 0.01 +
        validation.analytics.likes * 0.01 +
        validation.analytics.retweets * 0.01 +
        validation.analytics.replies * 0.01;
      console.log(`Calculated Twitter rewards: ${twitterRewards}`);

      // get the adSpace
      const adSpace = await db.collection(`${env.NODE_ENV}_adSpaces`).findOne({
        id: validation.adSpaceId,
        chainId: validation.chainId,
      });
      console.log(`Found adSpace with id: ${validation.adSpaceId}`);

      // Calculate the total rewards
      const totalRewards = twitterRewards + adSpace?.reward;
      console.log(`Calculated total rewards: ${totalRewards}`);

      // Update the adSpace
      await db.collection(`${env.NODE_ENV}_adSpaces`).updateOne(
        {
          id: validation.adSpaceId,
          chainId: validation.chainId,
        },
        {
          $set: {
            reward: totalRewards,
          },
        }
      );
      console.log(`Updated adSpace rewards for id: ${validation.adSpaceId}`);

      // Mark the validation as verified
      await db.collection(`${env.NODE_ENV}_validatedLogs`).updateOne(
        {
          taskId: validation.taskId,
        },
        { $set: { verified: true } }
      );
      console.log(
        `Marked validation as verified for taskId: ${validation.taskId}`
      );
    }
    console.log("All validations have been verified");

    // Push the validated logs to the onchain
    await operator();
  } catch (error) {
    console.error("Error in AVS Operator Script:", error);
  }
};
