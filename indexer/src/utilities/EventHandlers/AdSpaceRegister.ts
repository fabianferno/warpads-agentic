import mongoose from "mongoose";

export const AdSpaceRegister = async (
  id: number,
  owner: `0x${string}`,
  metadata: string,
  stakedValue: number
) => {
  await mongoose.connection.collection("adSpaces").insertOne({
    id: id,
    owner: owner,
    metadata: JSON.parse(metadata),
    stakedValue: stakedValue,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
