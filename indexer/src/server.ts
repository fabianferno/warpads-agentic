import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import indexRouter from "./routes/index";
import connectDB from "./config/db";
import { env } from "./config/env";
import { ContractIndexer } from "./class/ContractIndexer";

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

// Indexer Configuration
const chains = [
  {
    providerUrl: `https://base-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`,
    contractAddress: "0xE13286840a109A412e67077eE70191740AAA4d18",
    chainId: 84532,
  },
  {
    providerUrl: `https://arb-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`,
    contractAddress: "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3",
    chainId: 421614,
  },
  {
    providerUrl: `https://testnet.evm.nodes.onflow.org`,
    contractAddress: "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97",
    chainId: 545,
  },
];

// Start listening to events on all chains
const startIndexers = async () => {
  try {
    for (const chainConfig of chains) {
      const indexer = new ContractIndexer(chainConfig);
      await indexer.startListening();
      console.log(`Started indexer for chain ${chainConfig.chainId}`);
    }
  } catch (error) {
    console.error("Error starting indexers:", error);
  }
};

startIndexers();
