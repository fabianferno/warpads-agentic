import { client } from "../config/db";
import { env } from "../config/env";

export const getAllAdCampaigns = async (owner: string) => {
  try {
    const db = client.db();
    const adCampaigns = await db
      .collection(`${env.NODE_ENV}_adCampaigns`)
      .aggregate([
        {
          $match: {
            owner,
          },
        },
        {
          $lookup: {
            from: "requestLogs",
            localField: "id",
            foreignField: "adId",
            as: "insights",
          },
        },
        {
          $project: {
            id: 1,
            owner: 1,
            metadata: 1,
            priorityStake: 1,
            expiry: 1,
            active: 1,
            chainId: 1,
            createdAt: 1,
            updatedAt: 1,
            "insights.id": 1,
            "insights.adId": 1,
            "insights.adSpaceId": 1,
            "insights.requestedAt": 1,
          },
        },
      ])
      .toArray();
    return adCampaigns;
  } catch (error) {
    console.error(error);
    return [];
  }
};
