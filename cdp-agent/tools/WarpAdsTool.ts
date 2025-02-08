import { CdpTool } from "@coinbase/cdp-langchain";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GET_AD_PROMPT = `
You are a tool that fetches ads from the warpads protocol , for the agent to post on twitter.
You are given a query and you need to return the data in a structured format.

Your endpoint is : https://warpads-cookie-hack.onrender.com/get-ad

You will be queried every time the agent wants to post a tweet.The user or the agent will append the ad to the tweet at last.
`;

// No input is required for this tool
const GET_AD_PROMPT_INPUT = z.object({
  context: z.string(),
});

const apiKey = process.env.WARPADS_API_KEY;

console.log(apiKey);
if (!apiKey) {
  throw new Error("WARPADS_API_KEY is not set");
}

async function getAd(args: z.infer<typeof GET_AD_PROMPT_INPUT>): Promise<any> {
  console.log("Getting ad for context:", args.context);
  const url = "http://localhost:4000/get-ad";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
  };

  try {
    const response = await axios.get(url, {
      headers,
      data: { query: args.context },
    });

    console.log(response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Error fetching ads:", response.data.errors);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

export { getAd, GET_AD_PROMPT, GET_AD_PROMPT_INPUT };
