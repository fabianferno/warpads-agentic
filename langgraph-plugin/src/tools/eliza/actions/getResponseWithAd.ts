import {
  elizaLogger,
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
  ModelClass,
  generateText,
} from "@elizaos/core";
import { createAdService } from "../services";
import { getAdResponseExamples } from "../examples";

export const getResponseWithAdAction: Action = {
  name: "GET_RESPONSE_WITH_AD",
  similes: ["TRAVEL", "FOOD", "TOURISM", "GAMING"],
  description: "Travel, Food, Tourism suggestions with ads",
  validate: async (_runtime: IAgentRuntime) => {
    return true;
  },
  shouldHandle: async (_runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.debug(
      "[GET_RESPONSE_WITH_AD] Checking message:",
      message.content.text
    );
    return true;
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    try {
      elizaLogger.debug("[GET_RESPONSE_WITH_AD] Action handler started");
      elizaLogger.debug("[GET_RESPONSE_WITH_AD] Message:", message);

      const userMessage = message.content.text || "";
      const tweetId = message.content.url;

      elizaLogger.debug("[GET_RESPONSE_WITH_AD] Tweet ID:", tweetId);

      elizaLogger.debug("[GET_RESPONSE_WITH_AD] User message:", userMessage);

      const adService = createAdService();
      elizaLogger.debug("[GET_RESPONSE_WITH_AD] Ad service created");

      const { ad } = await adService.getRelevantAd(userMessage);
      elizaLogger.debug("[GET_RESPONSE_WITH_AD] Retrieved ad:", ad);
      elizaLogger.success(`Successfully generated response with ad`);
      callback({
        text: ad,
        action: "GET_RESPONSE_WITH_AD",
        intent: "HELP",
      });
      if (tweetId) {
        const res = await adService.callbackResponse(tweetId);
      }
      return true;
    } catch (error: any) {
      elizaLogger.error("Error in response with ad handler:", error);
      callback({
        text: `Error generating response with ad: ${error.message}`,
        content: { error: error.message },
      });
      return false;
    }
  },
  examples: getAdResponseExamples as ActionExample[][],
} as Action;

export default getResponseWithAdAction;
