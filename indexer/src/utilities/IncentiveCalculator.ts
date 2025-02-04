import connectDB, { client } from "../config/db";
import { env } from "../config/env";

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
          from: "validatedLogs",
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

    // fetch the agent name from the adspace

    // Call Cookie API to gain insights about the user
    // reward Calculation here
    reward = 0;

    // Once the reward is calculated, store it in the response to validated
    await db.collection("validatedLogs").insertOne({
      refResponseID: ad._id,
      validatedAt: new Date(),
    });
  });

  // Make Cookie API as a booster .

  const adSpace = await db.collection("adSpaces").findOne({
    id: ad[0].id,
  });
  console.log(adSpace);
  console.log(adSpace?.metadata.name);

  // Call Cookie API to gain insights about the user
  const cookieData = await fetch(
    `https://api.cookie.fun/v2/agents/twitterUsername/${adSpace?.metadata.name}?interval=_7Days`,
    {
      headers: {
        "x-api-key": env.COOKIE_API_KEY as string,
      },
    }
  );

  const cookieDataJson = await cookieData.json();
  console.log(cookieDataJson);

  const averageImpressionsCount = cookieDataJson.ok.averageImpressionsCount;
  const averageEngagementsCount = cookieDataJson.ok.averageEngagementsCount;
  console.log(averageImpressionsCount);
  console.log(averageEngagementsCount);

  reward =
    reward +
    averageImpressionsCount * 0.8 * 0.0001 +
    averageEngagementsCount * 0.2 * 0.0001;
  // store the reward in the database
  await db.collection("adSpaces").updateOne(
    {
      id: ad[0].id,
    },
    { $set: { reward: reward + ad.length * 1 } }
  );
};

calculateIncentive(2);
