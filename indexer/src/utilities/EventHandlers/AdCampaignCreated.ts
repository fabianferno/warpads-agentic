import { client } from "../../config/db";
import { PinataSDK } from "pinata-web3";
import { env } from "../../config/env";
import { createEmbedding } from "../CreateEmbeddings";
import { COLLECTION_NAME } from "../../modals/AdCampaignModel";
import { parseMetadata } from "../MetadataParser";

interface PinataMetadata {
  data: {
    description?: string;
    [key: string]: any;
  };
}

export const AdCampaignCreated = async (
  id: number,
  owner: `0x${string}`,
  metadata: string,
  priorityStake: number,
  expiry: number,
  chainId: number
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
  const metadataJson = (await pinata.gateways.get(metadata)) as PinataMetadata;
  console.log(metadataJson.data);

  const db = client.db();

  // Check if the ad campaign already exists
  const existingCampaign = await db
    .collection(COLLECTION_NAME)
    .findOne({ id: id });

  if (existingCampaign) {
    return "Ad campaign already exists";
  }

  const parsedMetadata = parseMetadata(JSON.stringify(metadataJson.data));

  // Create Embedding for the ad space.
  const embedding = await createEmbedding(parsedMetadata);

  // Create the ad space.
  await db.collection(COLLECTION_NAME).insertOne({
    id: id,
    owner: owner,
    metadata: metadataJson.data,
    priorityStake: Number(BigInt(priorityStake) / BigInt(10 ** 18)),
    expiry: expiry,
    active: true,
    chainId: chainId,
    embedding: embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Ad campaign created with id: ", id);
};
