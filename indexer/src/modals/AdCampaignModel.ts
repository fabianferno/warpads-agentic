import { ObjectId } from "mongodb";

export interface IAdCampaign {
  _id?: ObjectId;
  id: number;
  owner: string;
  metadata: object;
  priorityStake: number;
  expiry: number;
  active: boolean;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export const COLLECTION_NAME = "adCampaigns";
