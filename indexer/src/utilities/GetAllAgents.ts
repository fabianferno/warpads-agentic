import { client } from "../config/db";
import { env } from "../config/env";

export const getAllAgents = async (address: `0x${string}`) => {
  try {
    const db = client.db();
    const agents = await db
      .collection(`${env.NODE_ENV}_adSpaces`)
      .find({ owner: address })
      .toArray();
    return agents;
  } catch (error) {
    console.log(error);
    return [];
  }
};
