import { client } from "../../config/db";

export const trackResponse = async (
  apiKey: string,
  response: {
    platform: string;
    id: string;
  }
) => {
  const db = client.db();
  const adSpace = await db.collection("adSpaces").findOne({
    apiKey,
  });

  if (!adSpace) {
    throw new Error("Ad space not found");
  }

  await db.collection("responseLogs").insertOne({
    id: adSpace.id,
    apiKey,
    platform: response.platform,
    platformId: response.id,
    respondedAt: new Date(),
  });
};
