import { client } from "../../config/db";
import { createEmbedding } from "../CreateEmbeddings";
import { IAdCampaign, COLLECTION_NAME } from "../../modals/AdCampaignModel";

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(
    a.reduce((sum, value) => sum + value * value, 0)
  );
  const magnitudeB = Math.sqrt(
    b.reduce((sum, value) => sum + value * value, 0)
  );
  return dotProduct / (magnitudeA * magnitudeB);
}

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

  const similarities = campaigns.map((doc) => ({
    text: doc.metadata,
    similarity: cosineSimilarity(queryEmbeddings, doc.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);
  console.log(similarities.slice(0, 3));
  return similarities.slice(0, 3);
};
