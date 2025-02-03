import { client } from "../../config/db";
import { createEmbedding } from "../CreateEmbeddings";
import { IAdCampaign, COLLECTION_NAME } from "../../modals/AdCampaignModel";

export const searchCampaigns = async (query: string) => {
  const queryEmbeddings = await createEmbedding(query);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const db = client.db();
  const campaigns = await db
    .collection<IAdCampaign>(COLLECTION_NAME)
    .aggregate([
      {
        $vectorMatch: {
          queryVector: queryEmbeddings,
          path: "embedding",
          numCandidates: 100,
          limit: 5,
          index: "ad_vector_index",
          filter: {
            active: true,
            expiry: { $gt: nowInSeconds },
          },
        },
      },
    ])
    .toArray();

  console.log(`Found ${campaigns?.length} campaigns`);

  if (!campaigns || campaigns.length === 0) {
    console.log("No active campaigns found.");
    return [];
  }

  return campaigns;
};
