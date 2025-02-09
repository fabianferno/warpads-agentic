import connectDB, { client } from "../../config/db";
import { env } from "../../config/env";

export const validateTwitterAnalytics = async (
  taskId: string,
  analytics: any
) => {
  console.log(analytics);
  console.log(analytics.views);
  console.log(analytics.likes);
  console.log(analytics.retweets);
  console.log(analytics.replies);
  await connectDB();
  const db = client.db();
  const task = await db.collection(`${env.NODE_ENV}_validatedLogs`).findOne({
    taskId,
  });

  if (!task) {
    return "Task not found";
  }

  await db.collection(`${env.NODE_ENV}_validatedLogs`).updateOne(
    { taskId },
    {
      $set: {
        rewardsUpdatedAt: new Date(),
        verified: false,
        analytics: analytics,
      },
    }
  );
};
