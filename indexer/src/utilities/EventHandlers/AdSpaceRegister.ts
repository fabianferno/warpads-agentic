import mongoose from "mongoose";
import { PinataSDK } from "pinata";
import { env } from "../../config/env";
import { createEmbedding } from "../CreateEmbeddings";
export const AdSpaceRegister = async (
  id: number,
  owner: `0x${string}`,
  metadata: string,
  stakedValue: number
) => {
  // Fetch the metadata from pinata.
  const pinata = new PinataSDK({
    pinataJwt: env.PINATA_JWT,
    pinataGateway: env.PINATA_GATEWAY,
  });

  const metadataJson = await pinata.gateways.get(metadata);
  console.log(metadataJson.data);

  // Check if the ad space already exists.
  const adSpace = await mongoose.connection
    .collection("adSpaces")
    .findOne({ id: id });

  if (adSpace) {
    return "Ad space already exists";
  }

  // Create Embedding for the ad space.
  const embedding = await createEmbedding(metadataJson.data);

  // Create the ad space.
  await mongoose.connection.collection("adSpaces").insertOne({
    id: id,
    owner: owner,
    metadata: metadataJson.data,
    stakedValue: stakedValue,
    active: true,
    embedding: embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Ad space created with id: ", id);
};
