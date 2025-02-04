import { connect } from "http2";
import connectDB, { client } from "../config/db";

export const calculateIncentive = async (id: number) => {
  await connectDB();
  const db = client.db();
  const ad = await db
    .collection("responseLogs")
    .aggregate([
      {
        $match: {
          id: id,
        },
      },
      {
        $lookup: {
          from: "validationLogs",
          localField: "_id",
          foreignField: "refResponseID",
          as: "found",
        },
      },
      {
        $match: {
          found: { $size: 0 },
        },
      },
    ])
    .toArray();
  if (!ad) {
    throw new Error("Ad not found");
  }
  console.log(ad);
  // Todo : script to calculate the impressions and clicks from platform
  let reward = 0;
  ad.forEach(async (ad) => {
    console.log(ad.platformId);
    // reward Calculation here
    reward = 0;

    // Once the reward is calculated, store it in the response to validated
    await db.collection("validatedLogs").insertOne({
      refResponseID: ad._id,
      validatedAt: new Date(),
    });
  });
  // store the reward in the database
  await db.collection("adSpaces").updateOne(
    {
      id: ad[0].id,
    },
    { $set: { reward: reward + ad.length * 1 } }
  );
};

calculateIncentive(2);
