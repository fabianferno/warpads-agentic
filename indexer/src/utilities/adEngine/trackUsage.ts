import { client } from "../../config/db";
import { env } from "../../config/env";

export const trackUsage = async (
  apiKey: string,
  adId: string,
  chainId: string
) => {
  const db = client.db();
  const adSpace = await db.collection(`${env.NODE_ENV}_adSpaces`).findOne({
    apiKey,
  });

  if (!adSpace) {
    throw new Error("Ad space not found");
  }

  const ad = await db.collection(`${env.NODE_ENV}_adCampaigns`).findOne({
    id: parseInt(adId),
    chainId: parseInt(chainId),
  });

  if (!ad) {
    throw new Error("Ad not found");
  }

  const log = await db.collection(`${env.NODE_ENV}_requestLogs`).insertOne({
    id: adSpace.id,
    adId: parseInt(adId),
    chainId: parseInt(chainId),
    adSpaceId: adSpace.id,
    apiKey,
    requestedAt: new Date(),
  });

  console.log(log);
};
