import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import indexRouter from "./routes/index";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";

import { WarpAdsABI } from "./abi/WarpAds";
import connectDB from "./config/db";
import { env } from "./config/env";
import { AdSpaceRegister } from "./utilities/EventHandlers/AdSpaceRegister";
import { AdCampaignCreated } from "./utilities/EventHandlers/AdCampaignCreated";

const app: Application = express();
const PORT = env.PORT || 3000;

// Middleware
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

connectDB();

// Indexer

const PROVIDER_URL = `https://base-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = "0x070C0B63AbC6604f84E062E1C648b85a5ae4A4Ad";

const provider = new JsonRpcProvider(PROVIDER_URL);
const contract = new Contract(CONTRACT_ADDRESS, WarpAdsABI, provider);

const contractListener = async () => {
  try {
    // First verify the event exists in the ABI
    const eventFragment = contract.interface.getEvent("AdSpaceRegistered");

    contract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, metadataURI, warpStake, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);

        AdSpaceRegister(adSpaceId, owner, metadataURI, warpStake);
        console.log("Listening for AdSpaceRegistered events...");
      }
    );

    contract.on(
      "CampaignRegistered",
      (campaignId, owner, expiry, priorityStake, adContent, ...args) => {
        console.log("AdCampaign Created:");
        console.log("ID:", campaignId);
        console.log("Owner:", owner);
        console.log("Ad Content:", adContent);
        console.log("Priority Stake:", priorityStake);
        console.log("Expiry:", expiry);
        console.log("Additional args:", args);

        AdCampaignCreated(campaignId, owner, adContent, priorityStake, expiry);
        console.log("Listening for AdCampaignCreated events...");
      }
    );
  } catch (error) {
    console.error("Error setting up event listener:", error);
  }
};

contractListener();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
