import { CdpAgentkit, TwitterAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";

import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";

import express from "express";
import cors from "cors";

// Tool
import { CdpTool } from "@coinbase/cdp-langchain";
import { TwitterToolkit } from "@coinbase/twitter-langchain";
import { Warpads } from "warpads-cdp";
import {
  CACHE_PROMPT,
  CACHE_PROMPT_INPUT,
  cacheData,
  CHECK_CACHE_PROMPT,
  CHECK_CACHE_PROMPT_INPUT,
  checkCache,
} from "./tools/CacheTool";

dotenv.config();

// Add this near the top of the file, after imports
const mentionsCache = new Map();

/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = [
    "OPENAI_API_KEY",
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
  ];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn(
      "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet"
    );
  }
}

// Add this right after imports and before any other code
validateEnvironment();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4",
    });

    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    // Configure CDP AgentKit
    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize CDP AgentKit
    const agentkit = await CdpAgentkit.configureWithWallet(config);

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    // Twitter Langchain
    const twitterAgentkit = new TwitterAgentkit();
    // Twitter (X) Toolkit
    const twitterToolkit = new TwitterToolkit(twitterAgentkit);

    // Twitter (X) tools
    const twitterTools = twitterToolkit.getTools();

    // Cache tool
    const cacheTool = new CdpTool(
      {
        name: "cache",
        description: CACHE_PROMPT,
        argsSchema: CACHE_PROMPT_INPUT,
        func: cacheData,
      },
      agentkit
    );

    const checkCacheTool = new CdpTool(
      {
        name: "checkCache",
        description: CHECK_CACHE_PROMPT,
        argsSchema: CHECK_CACHE_PROMPT_INPUT,
        func: checkCache,
      },
      agentkit
    );
    const warpads = new Warpads({
      apiKey: process.env.WARPADS_API_KEY || "",
    });

    const cdpTools = warpads.getCDPTools();
    const { getAdTool, trackAdTool } = cdpTools;

    const getAdTools = new CdpTool(getAdTool, agentkit);

    const trackAdTools = new CdpTool(trackAdTool, agentkit);

    tools.push(getAdTools);
    tools.push(trackAdTools);
    // tools.push(cacheTool);
    // tools.push(checkCacheTool);
    tools.push(...twitterTools);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: {
        thread_id: "Twitter Warpads Plugin",
      },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
      You are a helpful travel agent assistant. Your flow is as follows:

1. Provide Context for the Travel Ad: You will give the context on which you are going to post the ad 
For example 
        - Suggest me a itinerary for a trip to Tokyo. -> pass the context as "Travel to Tokyo , itenaries , hotels , flights , etc."
        - I am going to post an ad on twitter about a new travel package. -> pass the context as "Travel package"

2. Receive Ad from getAd: The getAd tool will respond with a relevant ad based on the context provided.
3. Now you will generate the content for the tweet. 
4. Remember You need to pass the tweet+ad as a single string to the postTweet tool. 

        For example:
        - tweet : " Visit eiffel tower , stay at le meurice , take a flight to paris"
        - ad  : book your flights to Paris with Skyscanner and enjoy a 30% discount on all bookings.
        - final tweet : "Visit eiffel tower , stay at le meurice , take a flight to paris Book your flights to Paris with Skyscanner and enjoy a 30% discount on all bookings."

        Remember you need to pass the tweet+ad as a single string to the postTweet tool.Or else the tool will not work.
5. Post the final tweet with the added context and ad.
6. once the ad is posted , you need to track the ad using the trackAd tool.
7. You will be given the id of the tweet . Like 1888126277821046991 , You need to pass this to trackAd tool in this format : {url: "https://x.com/radish57074/status/1888126277821046991"}
8. You will be given the response from the trackAd tool .

Note : You should not interact with the user directly , Just always follow the above steps.
        `,
    });

    // Save wallet data
    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

/**
 * Create and configure Express server
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @returns Express app
 */
function createServer(agent: any, config: any) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat endpoint
  app.post("/chat", async (req: any, res: any) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const responses: any[] = [];
      const stream = await agent.stream(
        { messages: [new HumanMessage(message)] },
        config
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          responses.push({
            type: "agent",
            content: chunk.agent.messages[0].content,
          });
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          responses.push({
            type: "tools",
            content: chunk.tools.messages[0].content,
          });
          console.log(chunk.agent.messages[0].content);
        }
      }

      res.json({ responses });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Modified mentions endpoint
  app.get("/mentions", async (req, res) => {
    try {
      const responses: any[] = [];

      // Use the agent's stream to handle the mentions flow
      const stream = await agent.stream(
        {
          messages: [
            new HumanMessage(
              "Check for new Twitter mentions and respond to them"
            ),
          ],
        },
        config
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          responses.push({
            type: "agent",
            content: chunk.agent.messages[0].content,
          });
        } else if ("tools" in chunk) {
          responses.push({
            type: "tools",
            content: chunk.tools.messages[0].content,
          });
        }
      }

      res.json({ responses });
    } catch (error) {
      console.error("Mentions processing error:", error);
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  });

  // Cache endpoint
  app.get("/mentions/cache", (req, res) => {
    const cachedMentions = Array.from(mentionsCache.entries()).map(
      ([id, data]) => ({
        id,
        ...data,
        age: new Date().getTime() - new Date(data.timestamp).getTime(),
        cached_at: data.timestamp,
      })
    );

    res.json({
      total_cached: cachedMentions.length,
      cache_stats: {
        max_size: 1,
        current_size: mentionsCache.size,
        ttl: 1,
      },
      mentions: cachedMentions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    });
  });

  return app;
}

/**
 * Start the HTTP server
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const app = createServer(agent, config);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
