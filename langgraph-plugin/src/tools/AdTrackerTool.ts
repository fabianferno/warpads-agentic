import { z } from "zod";
import axios from "axios";

const TRACK_AD_PROMPT = `
You are a tool that tracks the ads posted by the agent on twitter to incentivize the agent to post more ads.
You will be a given a tweet url , which was posted by the agent with the embeded ad to it.

Your endpoint is : https://warpads-cookie-hack.onrender.com/track-response

You will be posting this url to the endpoint every time the agent  post a tweet with the ad.
`;

// No input is required for this tool
const TRACK_AD_PROMPT_INPUT = z.object({
  url: z.string(),
});

export function createAdTrackerTool(apiKey: string) {
  if (!apiKey) {
    throw new Error("WARPADS_API_KEY is not provided");
  }

  return async function trackAd(
    args: z.infer<typeof TRACK_AD_PROMPT_INPUT>
  ): Promise<any> {
    console.log("Tracking ad for url:", args.url);
    const url = "https://warpads-cookie-hack.onrender.com/track-response";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": apiKey,
    };

    //calling the endpoint
    console.log(url);
    try {
      const response = await axios.post(
        url,
        {
          platform: "twitter",
          id: args.url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching ads:", response.data.errors);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
}

export { TRACK_AD_PROMPT, TRACK_AD_PROMPT_INPUT };
