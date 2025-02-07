import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import indexRouter from "./routes/index";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";

import { WarpAdsABI } from "./abi/WarpAds";
import connectDB, { client } from "./config/db";
import { env } from "./config/env";
import { AdSpaceRegister } from "./utilities/EventHandlers/AdSpaceRegister";
import { AdCampaignCreated } from "./utilities/EventHandlers/AdCampaignCreated";

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
const SEI_PROVIDER_URL = `https://evm-rpc-arctic-1.sei-apis.com`;
const MODE_PROVIDER_URL = `https://sepolia.mode.network`;

const BASE_CONTRACT_ADDRESS = "0x070C0B63AbC6604f84E062E1C648b85a5ae4A4Ad";
const ARBITRUM_CONTRACT_ADDRESS = "0x00fF72F211f714CaF9C3E7C68f03E706f9AbD3d2";
const SEI_CONTRACT_ADDRESS = "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78";
const MODE_CONTRACT_ADDRESS = "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78";

const BaseProvider = new JsonRpcProvider(BASE_PROVIDER_URL);
const ArbitrumProvider = new JsonRpcProvider(ARBITRUM_PROVIDER_URL);
const SeiProvider = new JsonRpcProvider(SEI_PROVIDER_URL);
const ModeProvider = new JsonRpcProvider(MODE_PROVIDER_URL);
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
const SeiContract = new Contract(SEI_CONTRACT_ADDRESS, WarpAdsABI, SeiProvider);
const ModeContract = new Contract(
  MODE_CONTRACT_ADDRESS,
  WarpAdsABI,
  ModeProvider
);

const contractListener = async () => {
  try {
    // First verify the event exists in the ABI

    BaseContract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 84532);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    BaseContract.on(
      "CampaignRegistered",
      (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          84532
        );
      }
    );

    // Listen for events on the Arbitrum contract
    ArbitrumContract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 421614);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    ArbitrumContract.on(
      "CampaignRegistered",
      (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        AdCampaignCreated(
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

    // SEI Listener
    SeiContract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 713715);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    SeiContract.on(
      "CampaignRegistered",
      (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          919
        );
        console.log("Listening for AdCampaignCreated events...");
      }
    );

    // Mode Listener
    ModeContract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, warpStake, metadataURI, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake, 713715);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    ModeContract.on(
      "CampaignRegistered",
      (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        AdCampaignCreated(
          campaignId,
          owner,
          adContent,
          priorityStake,
          expiry,
          919
        );
        console.log("Listening for AdCampaignCreated events...");
      }
    );
  } catch (error) {
    console.error("Error setting up event listener:", error);
  }
};

contractListener();
