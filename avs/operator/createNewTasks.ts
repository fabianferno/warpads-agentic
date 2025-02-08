import { ethers } from "ethers";
import * as dotenv from "dotenv";
const { db } = require("../utils/mongo");
const fs = require("fs");
const path = require("path");
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
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

async function getAgentIdsToBeProcessed() {
  // TODO Review: Get the agentIds from the database
  const agentIds = await db
    .collection("requestLogs")
    .aggregate([
      {
        $group: {
          _id: "$agentId",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();
  return agentIds.map((agentId: any) => agentId.agentId);
}

async function createNewTask(agentId: string) {
  try {
    // Send a transaction to the createNewTask function
    const tx = await warpAdsServiceManager.createNewTask(agentId);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

// Function to create a new task with a random name every 15 seconds
function startCreatingTasks() {
  setInterval(() => {
    getAgentIdsToBeProcessed().then((agentIdsToBeProcessed) => {
      for (const agentId of agentIdsToBeProcessed) {
        console.log(`Creating new task with name: ${agentId}`);
        createNewTask(agentId);
      }
    });
  }, 90 * 60 * 1000); // 90 minutes
}

// Start the process
startCreatingTasks();
