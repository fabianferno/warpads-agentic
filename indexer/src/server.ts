import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import indexRouter from "./routes/index";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";

import { WarpAdsABI } from "./abi/WarpAds";
import connectDB from "./config/db";
import { env } from "./config/env";
import { AdSpaceRegister } from "./utilities/EventHandlers/AdSpaceRegister";
import { AdCampaignCreated } from "./utilities/EventHandlers/AdCampaignCreated";
import { RewardClaimed } from "./utilities/EventHandlers/RewardClaimed";

const app: Application = express();
const PORT = env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Sorry can't find that!");
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// DB connection
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectWithRetry = async (retryCount = 0) => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(
      `Failed to connect to MongoDB (attempt ${
        retryCount + 1
      }/${MAX_RETRIES}):`,
      err
    );
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
      setTimeout(() => connectWithRetry(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

connectWithRetry();

// Indexer

const BASE_PROVIDER_URL = `https://base-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
const ARBITRUM_PROVIDER_URL = `https://arb-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
const FLOW_PROVIDER_URL = `https://testnet.evm.nodes.onflow.org`;

const BASE_CONTRACT_ADDRESS = "0xE13286840a109A412e67077eE70191740AAA4d18";
const ARBITRUM_CONTRACT_ADDRESS = "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3";
const FLOW_CONTRACT_ADDRESS = "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97";
const BaseProvider = new JsonRpcProvider(BASE_PROVIDER_URL);
const ArbitrumProvider = new JsonRpcProvider(ARBITRUM_PROVIDER_URL);
const FlowProvider = new JsonRpcProvider(FLOW_PROVIDER_URL);
const BaseContract = new Contract(
  BASE_CONTRACT_ADDRESS,
  WarpAdsABI,
  BaseProvider
);
const ArbitrumContract = new Contract(
  ARBITRUM_CONTRACT_ADDRESS,
  WarpAdsABI,
  ArbitrumProvider
);

const FlowContract = new Contract(
  FLOW_CONTRACT_ADDRESS,
  WarpAdsABI,
  FlowProvider
);

const contractListener = async () => {
  try {
    // First verify the event exists in the ABI

    BaseContract.on(
      "AdSpaceRegistered",
      async (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        await AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 84532);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    BaseContract.on(
      "CampaignRegistered",
      async (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        await AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          84532
        );
      }
    );

    BaseContract.on(
      "RewardsClaimed",
      async (adSpaceId, user, amount, ...args) => {
        console.log("Rewards Claimed:");
        console.log("Ad Space ID:", adSpaceId);
        console.log("User:", user);
        console.log("Amount:", amount);
        console.log("Additional args:", args);
        await RewardClaimed(adSpaceId, user, amount);
      }
    );

    // Listen for events on the Arbitrum contract
    ArbitrumContract.on(
      "AdSpaceRegistered",
      async (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        await AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 421614);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    ArbitrumContract.on(
      "CampaignRegistered",
      async (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        await AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          421614
        );
        console.log("Listening for AdCampaignCreated events...");
      }
    );

    ArbitrumContract.on(
      "RewardsClaimed",
      async (adSpaceId, user, amount, ...args) => {
        console.log("Rewards Claimed:");
        console.log("Ad Space ID:", adSpaceId);
        console.log("User:", user);
        console.log("Amount:", amount);
        console.log("Additional args:", args);
        await RewardClaimed(adSpaceId, user, amount);
      }
    );

    // Listen for events on the Flow contract

    FlowContract.on(
      "AdSpaceRegistered",
      async (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        await AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 545);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    FlowContract.on(
      "CampaignRegistered",
      async (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        await AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          545
        );
        console.log("Listening for AdCampaignCreated events...");
      }
    );

    FlowContract.on(
      "RewardsClaimed",
      async (adSpaceId, user, amount, ...args) => {
        console.log("Rewards Claimed:");
        console.log("Ad Space ID:", adSpaceId);
        console.log("User:", user);
        console.log("Amount:", amount);
        console.log("Additional args:", args);
        await RewardClaimed(adSpaceId, user, amount);
      }
    );
  } catch (error) {
    console.error("Error setting up event listener:", error);
  }
};

contractListener();
