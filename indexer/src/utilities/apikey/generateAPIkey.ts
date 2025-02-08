import crypto from "crypto";
import { client } from "../../config/db";
import { env } from "../../config/env";

// Generate random 32-character API key
export const generateAPIKey = async (id: number) => {
  try {
    const idHex = id.toString(16);
    const randomPart = crypto.randomBytes(16).toString("hex");

    const db = client.db();

    // Check if the id exists in the database
    const agent = await db
      .collection(`${env.NODE_ENV}_adSpaces`)
      .findOne({ id });
    console.log(agent);
    if (!agent) {
      return "Invalid Agent";
    }

    // append the api key in the document
    const result = await db
      .collection(`${env.NODE_ENV}_adSpaces`)
      .updateOne({ id }, { $set: { apiKey: `${idHex}x${randomPart}` } });

    if (result.modifiedCount === 0) {
      return "Error";
    }

    return `${idHex}x${randomPart}`;
  } catch (error) {
    console.log(error);
    return "Error";
  }
};
