import { client } from "../../config/db";

export const trackUsage = async (apiKey: string) => {
  const db = client.db();
  const adSpace = await db.collection("adSpaces").findOne({
    apiKey,
  });

  if (!adSpace) {
    throw new Error("Ad space not found");
  }

  const log = await db.collection("requestLogs").insertOne({
    id: adSpace.id,
    apiKey,
    requestedAt: new Date(),
  });

  console.log(log);
};
