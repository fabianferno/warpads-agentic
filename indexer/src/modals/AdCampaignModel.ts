import { ObjectId } from "mongodb";
import { env } from "../config/env";

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

export const COLLECTION_NAME = `${env.NODE_ENV}_adCampaigns`;
