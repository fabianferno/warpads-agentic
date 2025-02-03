import mongoose from "mongoose";
import { PinataSDK } from "pinata-web3";
import { env } from "../../config/env";
import { createEmbedding } from "../CreateEmbeddings";
export const AdCampaignCreated = async (
  id: number,
  owner: `0x${string}`,
  metadata: string,
  priorityStake: number,
  expiry: number
) => {
  // Fetch the metadata from pinata.
  const pinata = new PinataSDK({
    pinataJwt: env.PINATA_JWT,
    pinataGateway: env.PINATA_GATEWAY,
  });

  console.log(metadata);
  if (!metadata) {
    console.log("Metadata not found");
    return;
  }
  const metadataJson = await pinata.gateways.get(metadata);
  console.log(metadataJson.data);

  // Check if the ad space already exists.
  const adSpace = await mongoose.connection
    .collection("adCampaigns")
    .findOne({ id: id });

  if (adSpace) {
    return "Ad campaign already exists";
  }

  // Create Embedding for the ad space.
  const embedding = await createEmbedding(JSON.stringify(metadataJson.data));

  // Create the ad space.
  await mongoose.connection.collection("adCampaigns").insertOne({
    id: id,
    owner: owner,
    metadata: metadataJson.data,
    priorityStake: priorityStake,
    expiry: expiry,
    active: true,
    embedding: embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Ad campaign created with id: ", id);
};
