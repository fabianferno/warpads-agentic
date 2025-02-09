import { ethers } from "ethers";
import * as dotenv from "dotenv";
import "dotenv/config";
import connectDB, { client } from "./db";

const fs = require("fs");
const path = require("path");
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV environment variable is required");
}

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is required");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
let chainId = 31337;

const avsDeploymentData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `../contracts/deployments/warpads/${chainId}.json`),
    "utf8"
  )
);
const warpAdsServiceManagerAddress =
  avsDeploymentData.addresses.warpAdsServiceManager;
const warpAdsServiceManagerABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/WarpAdsServiceManager.json"),
    "utf8"
  )
);
// Initialize contract objects from ABIs
const warpAdsServiceManager = new ethers.Contract(
  warpAdsServiceManagerAddress,
  warpAdsServiceManagerABI,
  wallet
);

async function createNewTasks() {
  try {
    await connectDB();
    const db = client.db();

    const validatingResponse = await db
      .collection(`${process.env.NODE_ENV || "development"}_validatedLogs`)
      .find({
        verified: false,
      })
      .toArray();

    console.log(`Found ${validatingResponse.length} unverified validations`);

    for (const validation of validatingResponse) {
      console.log(`Processing validation for taskId: ${validation.taskId}`);
      let twitterRewards = 0;

      // Calculate the twitter rewards
      twitterRewards =
        validation.analytics.views * 0.01 +
        validation.analytics.likes * 0.01 +
        validation.analytics.retweets * 0.01 +
        validation.analytics.replies * 0.01;
      console.log(`Calculated Twitter rewards: ${twitterRewards}`);

      // get the adSpace
      const adSpace = await db
        .collection(`${process.env.NODE_ENV || "development"}_adSpaces`)
        .findOne({
          id: validation.adSpaceId,
          chainId: validation.chainId,
        });
      console.log(`Found adSpace with id: ${validation.adSpaceId}`);

      // Calculate the total rewards
      const totalRewards = twitterRewards + adSpace?.reward;
      console.log(`Calculated total rewards: ${totalRewards}`);

      // Update the adSpace
      await db
        .collection(`${process.env.NODE_ENV || "development"}_adSpaces`)
        .updateOne(
          {
            id: validation.adSpaceId,
            chainId: validation.chainId,
          },
          {
            $set: {
              reward: totalRewards,
            },
          }
        );
      console.log(`Updated adSpace rewards for id: ${validation.adSpaceId}`);

      // Mark the validation as verified
      await db
        .collection(`${process.env.NODE_ENV || "development"}_validatedLogs`)
        .updateOne(
          {
            taskId: validation.taskId,
          },
          { $set: { verified: true } }
        );
      console.log(
        `Marked validation as verified for taskId: ${validation.taskId}`
      );
    }
    console.log("All validations have been verified");

    const adSpaces = await db
      .collection(`${process.env.NODE_ENV || "development"}_adSpaces`)
      .find({
        $expr: {
          $and: [
            { $gt: ["$reward", 0] },
            { $lt: ["$onchainReward", "$reward"] },
          ],
        },
      })
      .toArray();

    // TODO: Send a transaction to the createNewTask function
    const tx = await warpAdsServiceManager.createNewTask(
      JSON.stringify(adSpaces)
    );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

// Function to create a new task with a random name every 15 seconds
function startCreatingTasks() {
  console.log("Creating new tasks every 5 minutes");
  // Push the validated logs to the onchain
  createNewTasks();
}

// Start the process
startCreatingTasks();
