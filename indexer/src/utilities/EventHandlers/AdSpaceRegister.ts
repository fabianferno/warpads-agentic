import { client } from "../../config/db";
import { PinataSDK } from "pinata-web3";
import { env } from "../../config/env";
import crypto from "crypto";

export const AdSpaceRegister = async (
  id: number,
  owner: `0x${string}`,
  metadata: string,
  stakedValue: number,
  chainId: number
) => {
  // Fetch the metadata from pinata.
  const pinata = new PinataSDK({
    pinataJwt: env.PINATA_JWT,
    pinataGateway: env.PINATA_GATEWAY,
  });

  const metadataJson = await pinata.gateways.get(metadata);
  console.log(metadataJson.data);

  const db = client.db();

  // Check if the ad space already exists
  const adSpace = await db.collection("adSpaces").findOne({ id: id });

  if (adSpace) {
    return "Ad space already exists";
  }

  // Else generate a new API key for the ad space
  const idHex = id.toString(16);
  const randomPart = crypto.randomBytes(16).toString("hex");
  const apiKey = `${idHex}-${randomPart}`;

  // Create the ad space
  await db.collection("adSpaces").insertOne({
    id: id,
    owner: owner,
    metadata: metadataJson.data,
    stakedValue: stakedValue,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    apiKey: apiKey,
    chainId: chainId,
  });

  console.log("Ad space created with id: ", id);
};
