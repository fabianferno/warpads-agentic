import { searchCampaigns } from "../search/campaignSearch";
import { env } from "../../config/env";
import { parseMetadata } from "../MetadataParser";
// If your Node version doesn't support global fetch, uncomment the line below
// import fetch from "node-fetch";

export const adEngine = async (query: string) => {
  // Get the top ad campaigns for the query
  const campaigns = await searchCampaigns(query);

  const parsedCampaigns = campaigns.map((c) => ({
    text: parseMetadata(JSON.stringify(c.metadata)),
    chainId: c.chainId,
    id: c.id,
  }));

  console.log(parsedCampaigns);

  // Build the messages payload for the OpenAI API
  const messages = [
    {
      role: "system",
      content: `You are an ad selection expert. Given a query and relevant ad campaigns, select the most appropriate ad and provide a oneliner ad to be appended with the tweet.
      
Steps to be followed:
1. You will be given a query and relevant ad campaigns.
2. You need to select the most appropriate ad campaign from the given query.
3. You need to provide a oneliner ad to be appended with the tweet.
4. If there are multiple ads or the score of the relavance of the ads are same or very close, in the ad campaign, you might find the priority stake, so choose the one with more stake.
5. But keep in mind the ad relavance is more important than the stake.
6. Generate the ads only from the provided ad campaigns; do not make up any ad or any other text.
7. Avoid suggesting ads which are not related to the query and don't include any other text except the ad data.
Choose ads based on the ad param in the metadata of the ad . If any suits please strictly send "No ad found" if they are not related.
8. If you are unable to find the best suitable ad campaign, you need to return "No ad found".
9. Once you have selected the ad, you need to rethink again to verify the ad is most relevant to the query.
10. If you are unable to find the best suitable ad campaign, you need to return "No ad found".

Example:
1. Query: "@WanderGuideBot Best budget destinations in Europe?
   WanderGuideBot: Check out Krakow, Porto, and Sofia!"
   Response: Pro tip: Book flights on Skyscanner for hidden deals. They're running a flash sale today only 👉 Explore Skyscanner

2. Query: "@GameMasterBot Any new indie games worth playing?"
   Response: FYI: Steam has a 40% discount on it right now 👉 Grab it here

3. Query: "@DeFiGuruBot Hey, I'm looking to stake some ETH. What's the best option right now?"
   Response: Oh, and since you're into DeFi, check out Ledger Nano X—it's on sale for 20% off this week. Secure your ETH while staking! 🔒

Select the most appropriate ad campaign based on the above guidelines.

The Output should be in the following format:
{
  "ad": "string",
  "chainId": "string",
  "id": "string"
}



`,
    },
    {
      role: "user",
      content: `Query: ${query}\nRelevant Campaigns:\n${parsedCampaigns
        .map((c) => `${c.text}\nChainId: ${c.chainId}\nId: ${c.id}`)
        .join("\n\n")}`,
    },
  ];

  // Prepare the request body for the OpenAI API call
  const requestBody = {
    model: "gpt-3.5-turbo",
    messages,
  };

  const apiKey = env.OPENAI_API_KEY;
  const apiUrl = "https://api.fabianferno.com/api/openai/chat/completions";

  // Make the POST request to OpenAI's API
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${apiKey}`,
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  console.log(data.choices[0].message.content);

  const ad = data.choices[0].message.content.trim();

  // Check if the OpenAI response indicates that no ad was found
  if (ad.includes("No ad found")) {
    return "No ad found";
  }

  const adData = JSON.parse(ad);

  return adData;
};

// adEngine("I want to travel to Europe");
