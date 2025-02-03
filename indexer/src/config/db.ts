import { MongoClient } from "mongodb";
import { env } from "./env";

const MONGO_URI = env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

let client: MongoClient;

async function connectDB(): Promise<MongoClient> {
  try {
    if (client) {
      return client;
    }

    client = new MongoClient(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      w: "majority",
    });

    await client.connect();
    console.log("✅ MongoDB connection established");

    await client.db().command({ ping: 1 });
    console.log("Successfully connected to MongoDB.");

    process.on("SIGINT", async () => {
      if (client) {
        await client.close();
        console.log("MongoDB connection closed through app termination");
      }
      process.exit(0);
    });

    return client;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

export default connectDB;
export { client };
