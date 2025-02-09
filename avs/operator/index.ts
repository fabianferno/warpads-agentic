import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { ChainHandler } from "../utils/ChainHandler";
import { chainConfigs } from "../utils/chainConfigs";
import connectDB, { client } from "./db";

const fs = require("fs");
const path = require("path");
dotenv.config();

// Check if the process.env object is empty
if (!Object.keys(process.env).length) {
  throw new Error("process.env object is empty");
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
// Load core deployment data
const coreDeploymentData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `../contracts/deployments/core/${chainId}.json`),
    "utf8"
  )
);

const delegationManagerAddress = coreDeploymentData.addresses.delegation; // todo: reminder to fix the naming of this contract in the deployment file, change to delegationManager
const avsDirectoryAddress = coreDeploymentData.addresses.avsDirectory;
const warpAdsServiceManagerAddress =
  avsDeploymentData.addresses.warpAdsServiceManager;
const ecdsaStakeRegistryAddress = avsDeploymentData.addresses.stakeRegistry;

// Load ABIs
const delegationManagerABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/IDelegationManager.json"),
    "utf8"
  )
);
const ecdsaRegistryABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/ECDSAStakeRegistry.json"),
    "utf8"
  )
);
const warpAdsServiceManagerABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/WarpAdsServiceManager.json"),
    "utf8"
  )
);
const avsDirectoryABI = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../abis/IAVSDirectory.json"), "utf8")
);

// Initialize contract objects from ABIs
const delegationManager = new ethers.Contract(
  delegationManagerAddress,
  delegationManagerABI,
  wallet
);
const warpAdsServiceManager = new ethers.Contract(
  warpAdsServiceManagerAddress,
  warpAdsServiceManagerABI,
  wallet
);
const ecdsaRegistryContract = new ethers.Contract(
  ecdsaStakeRegistryAddress,
  ecdsaRegistryABI,
  wallet
);
const avsDirectory = new ethers.Contract(
  avsDirectoryAddress,
  avsDirectoryABI,
  wallet
);

const signAndRespondToTask = async (
  taskIndex: number,
  taskCreatedBlock: number,
  agentIds: string
) => {
  // TODO: Calculate the incentive here
  // const message = await getIncentiveMessage(agentId);

  console.log("Operator started");
  await connectDB();
  const db = client.db();

  const chainHandlers = chainConfigs.map(
    (config) =>
      new ChainHandler(config, process.env.VALIDATOR_KEY as string, db)
  );

  const adSpaces = JSON.parse(agentIds);

  console.log("AdSpaces found:", adSpaces.length);

  // Group rewards by chain
  const rewardsByChain = chainConfigs.reduce((acc, config) => {
    acc[config.chainId] = {
      ids: [] as number[],
      rewards: [] as number[],
    };
    return acc;
  }, {} as Record<number, { ids: number[]; rewards: number[] }>);

  // Distribute rewards to respective chains
  for (const adSpace of adSpaces) {
    const remainingReward = adSpace.reward - (adSpace.onchainReward || 0);
    if (rewardsByChain[adSpace.chainId]) {
      rewardsByChain[adSpace.chainId].ids.push(adSpace.id);
      rewardsByChain[adSpace.chainId].rewards.push(remainingReward * 10 ** 18);
    }
  }

  const rewards = [];
  // Update rewards for each chain
  for (let i = 0; i < chainConfigs.length; i++) {
    const config = chainConfigs[i];
    const chainData = rewardsByChain[config.chainId];
    await chainHandlers[i].updateRewards(chainData.ids, chainData.rewards);

    rewards.push(chainData);
  }

  // TODO: Write the incentive rewards to AVS
  const message = `${JSON.stringify(rewards)}`; // Change this to agent specific message

  const messageHash = ethers.solidityPackedKeccak256(["string"], [message]);
  const messageBytes = ethers.getBytes(messageHash);
  const signature = await wallet.signMessage(messageBytes);

  console.log(`Signing and responding to task ${taskIndex}`);

  const operators = [await wallet.getAddress()];
  const signatures = [signature];
  const signedTask = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address[]", "bytes[]", "uint32"],
    [
      operators,
      signatures,
      ethers.toBigInt((await provider.getBlockNumber()) - 1),
    ]
  );

  const tx = await warpAdsServiceManager.respondToTask(
    { name: agentIds, taskCreatedBlock: taskCreatedBlock },
    taskIndex,
    signedTask
  );
  await tx.wait();
  console.log(`Responded to task.`);
};

const registerOperator = async () => {
  // Registers as an Operator in EigenLayer.
  try {
    const tx1 = await delegationManager.registerAsOperator(
      {
        __deprecated_earningsReceiver: await wallet.address,
        delegationApprover: "0x0000000000000000000000000000000000000000",
        stakerOptOutWindowBlocks: 0,
      },
      ""
    );
    await tx1.wait();
    console.log("Operator registered to Core EigenLayer contracts");
  } catch (error) {
    console.error("Error in registering as operator:", error);
  }

  const salt = ethers.hexlify(ethers.randomBytes(32));
  const expiry = Math.floor(Date.now() / 1000) + 3600; // Example expiry, 1 hour from now

  // Define the output structure
  let operatorSignatureWithSaltAndExpiry = {
    signature: "",
    salt: salt,
    expiry: expiry,
  };

  // Calculate the digest hash, which is a unique value representing the operator, avs, unique value (salt) and expiration date.
  const operatorDigestHash =
    await avsDirectory.calculateOperatorAVSRegistrationDigestHash(
      wallet.address,
      await warpAdsServiceManager.getAddress(),
      salt,
      expiry
    );
  console.log(operatorDigestHash);

  // Sign the digest hash with the operator's private key
  console.log("Signing digest hash with operator's private key");
  const operatorSigningKey = new ethers.SigningKey(process.env.PRIVATE_KEY!);
  const operatorSignedDigestHash = operatorSigningKey.sign(operatorDigestHash);

  // Encode the signature in the required format
  operatorSignatureWithSaltAndExpiry.signature = ethers.Signature.from(
    operatorSignedDigestHash
  ).serialized;

  console.log("Registering Operator to AVS Registry contract");

  // Register Operator to AVS
  // Per release here: https://github.com/Layr-Labs/eigenlayer-middleware/blob/v0.2.1-mainnet-rewards/src/unaudited/ECDSAStakeRegistry.sol#L49
  const tx2 = await ecdsaRegistryContract.registerOperatorWithSignature(
    operatorSignatureWithSaltAndExpiry,
    wallet.address
  );
  await tx2.wait();
  console.log("Operator registered on AVS successfully");
};

const monitorNewTasks = async () => {
  //console.log(`Creating new task "EigenWorld"`);
  //await WarpAdsServiceManager.createNewTask("EigenWorld");

  warpAdsServiceManager.on(
    "NewTaskCreated",
    async (taskIndex: number, task: any) => {
      console.log(`New task detected: ${task.name}`);
      await signAndRespondToTask(taskIndex, task.taskCreatedBlock, task.name);
    }
  );

  console.log("Monitoring for new tasks...");
};

const main = async () => {
  await registerOperator();
  monitorNewTasks().catch((error) => {
    console.error("Error monitoring tasks:", error);
  });
};

main().catch((error) => {
  console.error("Error in main function:", error);
});
