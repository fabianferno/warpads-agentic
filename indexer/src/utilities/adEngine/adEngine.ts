import OpenAI from "openai";
import { searchCampaigns } from "../search/campaignSearch";
import { env } from "../../config/env";
import { parseMetadata } from "../MetadataParser";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const adEngine = async (query: string) => {
  // This will give the top 3 adcampaigns
  const campaigns = await searchCampaigns(query);

  const parsedCampaigns = campaigns.map((c) => {
    return {
      text: parseMetadata(JSON.stringify(c.metadata)),
      score: c.similarity,
    };
  });
  console.log(parsedCampaigns);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an ad selection expert. Given a query and relevant ad campaigns, select the most appropriate ad and provide a oneliner ad to be appended with the tweet.
        The oneliner should be catchy and should be a single line , and look like a ad , which is promoted in the relavance to the query.
        Steps to be followed.
        1. You will be given a query and relevant ad campaigns.
        2. You need to select the most appropriate ad campaign from the given query.
        3. You need to provide a oneliner ad to be appended with the tweet.
        4. If there are multiple ads or the score of the relavance of the ads are same or very close , in the ad campaign , you might find the priority stake , so choose the one with more stake.
        5. But keep in mind the ad relavance is more important than the stake.
        6. Generate the ads only from the provided ad campaigns , do not make up any ad or any other text.
        7. Avoid suggesting ads which are not related to the query and dont include any other text except the ad data .
        8. If you are unable to find the best suitable ad campaign , you need to return "No ad found"


        Example:
        1. Query: "@WanderGuideBot Best budget destinations in Europe?
                WanderGuideBot: Check out Krakow, Porto, and Sofia! "
        Resposne : Pro tip: Book flights on Skyscanner for hidden deals.They’re running a flash sale today only 👉 Explore Skyscanner

        2. Query: @GameMasterBot Any new indie games worth playing?
                GameMasterBot: Absolutely! Try Hollow Realms—it’s like Dark Souls meets Zelda. 🎮
        Resposne : FYI: Steam has a 40% discount on it right now 👉 Grab it here

        Note the below example is just for reference , which you should not follow , but just for your understanding.
        3. Query : @DeFiGuruBot Hey, I’m looking to stake some ETH. What’s the best option right now?
                DeFiGuruBot: Hey! 👋 Based on your wallet history, you might like Rocket Pool for decentralized staking. It’s user-friendly and has great APY.
                Resposne : Pro tip: Book flights on Skyscanner for hidden deals.They’re running a flash sale today only 👉 Explore Skyscanner
            Response : Oh, and since you’re into DeFi, check out Ledger Nano X—it’s on sale for 20% off this week. Secure your ETH while staking! 🔒

            So in the above example , the ad is not related to the query , but it is related to the DeFiGuruBot , Just because the tweet is related to the Defi , you need not suggest them a ledger add , which would be a invasion .
        
            So Keep in mind the above point , and select the most appropriate ad campaign.
            `,
      },
      {
        role: "user",
        content: `Query: ${query}\nRelevant Campaigns:\n${parsedCampaigns
          .map((c) => c.text)
          .join("\n")}`,
      },
    ],
  });

  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
};
