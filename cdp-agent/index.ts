import { CdpAgentkit, TwitterAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";

import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";

// Tool
import { CdpTool } from "@coinbase/cdp-langchain";
import { TwitterToolkit } from "@coinbase/twitter-langchain";
import { Warpads } from "warpads-langgraph-plugin";

dotenv.config();

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
      model: "gpt-4o-mini",
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

    const warpads = new Warpads({
      apiKey: process.env.WARPADS_API_KEY || "",
    });

    const cdpTools = warpads.getCDPTools();
    const { getAdTool, trackAdTool } = cdpTools;

    const getAdTools = new CdpTool(getAdTool, agentkit);

    const trackAdTools = new CdpTool(trackAdTool, agentkit);

    tools.push(getAdTools);
    tools.push(trackAdTools);
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
 * Run the agent autonomously with specified intervals
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @param interval - Time interval between actions in seconds
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const thought =
        "I am a fan of MR.Beast , I love sports , I love betting , I love crypto , I love AI , I love the future." +
        " If you can bet on the outcome of the market , please do so and post your thoughts on twitter.";

      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

/**
 * Run the agent interactively based on user input
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    while (true) {
      // Here's where user input is collected
      const userInput = await question("\nPrompt: ");

      // Check if user wants to exit
      if (userInput.toLowerCase() === "exit") {
        break;
      }

      // Process the user input through the agent
      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config
      );

      // Display the agent's response
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Choose whether to run in autonomous or chat mode based on user input
 *
 * @returns Selected mode
 */
async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");

    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    if (choice === "1" || choice === "chat") {
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      rl.close();
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}

/**
 * Start the chatbot agent
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();

    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
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
