import { CdpTool } from "@coinbase/cdp-langchain";
import { z } from "zod";

const FETCH_PROMPT = `
You are a tool that fetches data from the graph protocol , for the prediction markets. 
You are given a query and you need to return the data in a structured format.

Your endpoint is : https://api.studio.thegraph.com/query/73364/radish-basesepolia/version/latest

query is : 
query MyQuery {
  markets {
    creator
    endTime
    id
    marketContract
    question
    resolved
    totalNo
    totalPriceToken
    totalStaked
    totalYes
    won
  }
}

You will be queried every time a user wants to place a bet.The user or the agent will choose any market from the list which is suitable accor
to the user preference.
`;

// No input is required for this tool
const FETCH_PROMPT_Input = z.object({});

async function fetchMarkets(
  args: z.infer<typeof FETCH_PROMPT_Input>
): Promise<any> {
  const url =
    "https://api.studio.thegraph.com/query/73364/radish-basesepolia/version/latest";

  const query = `
    query MyQuery {
      markets {
        creator
        endTime
        id
        marketContract
        question
        resolved
        totalNo
        totalPriceToken
        totalStaked
        totalYes
        won
      }
    }
  `;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body = JSON.stringify({ query });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json();

    if (response.ok) {
      return JSON.stringify(data.data.markets);
    } else {
      console.error("Error fetching data:", data.errors);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

export { fetchMarkets, FETCH_PROMPT, FETCH_PROMPT_Input };
