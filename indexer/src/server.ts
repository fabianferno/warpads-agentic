import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import indexRouter from "./routes/index";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";

import { WarpAdsABI } from "./abi/WarpAds";
import connectDB from "./config/db";
import { env } from "./config/env";

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
const CONTRACT_ADDRESS = "0x63b87AE482CB7Bb0C5dF0731562fB6768364A216";

const provider = new JsonRpcProvider(PROVIDER_URL);
const contract = new Contract(CONTRACT_ADDRESS, WarpAdsABI, provider);

const contractListener = async () => {
  try {
    // First verify the event exists in the ABI
    const eventFragment = contract.interface.getEvent("AdSpaceRegistered");
    // console.log("Found event:", eventFragment);

    contract.on(
      "AdSpaceRegistered",
      (adSpaceId, owner, metadataURI, warpStake, ...args) => {
        console.log("AdSpace Registered:");
        console.log("ID:", adSpaceId);
        console.log("Owner:", owner);
        console.log("Metadata URI:", metadataURI);
        console.log("Warp Stake:", warpStake);
        console.log("Additional args:", args);
      }
    );

    console.log("Listening for AdSpaceCreated events...");
  } catch (error) {
    console.error("Error setting up event listener:", error);
  }
};

contractListener();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
