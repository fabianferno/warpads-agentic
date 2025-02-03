import mongoose from "mongoose";
import { env } from "./env";

const MONGO_URI = env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

// Basic connection function
async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connection established");

    // Connection events
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});

export default connectDB;
