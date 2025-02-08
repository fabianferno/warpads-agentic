import { client } from "../../config/db";
import { env } from "../../config/env";

export const trackResponse = async (
  apiKey: string,
  response: {
    platform: string;
    id: string;
  }
) => {
  const db = client.db();
  const adSpace = await db.collection(`${env.NODE_ENV}_adSpaces`).findOne({
    apiKey,
  });

  if (!adSpace) {
    throw new Error("Ad space not found");
  }

  await db.collection(`${env.NODE_ENV}_responseLogs`).insertOne({
    id: adSpace.id,
    apiKey,
    platform: response.platform,
    platformId: response.id,
    respondedAt: new Date(),
  });

  return adSpace.id;
};
