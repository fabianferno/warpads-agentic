import { client } from "../config/db";

export const getAllAgents = async (address: `0x${string}`) => {
  try {
    const db = client.db();
    const agents = await db
      .collection("adSpaces")
      .find({ owner: address })
      .toArray();
    return agents;
  } catch (error) {
    console.log(error);
    return [];
  }
};
