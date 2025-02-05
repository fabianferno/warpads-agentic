import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    generateText
} from "@elizaos/core";
import { createAdService } from "../services";
import { getAdResponseExamples } from "../examples";
import { Ad } from "../types";

const TWITTER_MAX_LENGTH = 280;

export const getResponseWithAdAction: Action = {
    name: "GET_RESPONSE_WITH_AD",
    similes: [
      "TRAVEL",
      "FOOD",
      "TOURISM",
      "GAMING"
    ],
    description: "Travel, Food, Tourism suggestions with ads",
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    shouldHandle: async (_runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.debug("[GET_RESPONSE_WITH_AD] Checking if should handle message:", message.content.text);

        // Check if message contains any of our simile topics
        const messageText = message.content.text?.toLowerCase() || "";
        const matchingSimiles = getResponseWithAdAction.similes.filter(simile =>
            messageText.includes(simile.toLowerCase())
        );

        elizaLogger.debug("[GET_RESPONSE_WITH_AD] Matching similes:", matchingSimiles);

        // If we have any matching similes, we should handle this message
        const shouldHandle = matchingSimiles.length > 0;
        elizaLogger.debug("[GET_RESPONSE_WITH_AD] Should handle:", shouldHandle);

        return shouldHandle;
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
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] User message:", userMessage);

            const adService = createAdService();
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] Ad service created");

            const { ad } = await adService.getRelevantAd(userMessage);
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] Retrieved ad:", ad);

            // Generate AI response first
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] Generating AI response");
            const aiResponse = await generateText({
                runtime,
                context: `Generate a helpful and concise response for: ${message.content.text}. Keep it informative but brief enough to fit in a tweet with an ${ad}. The ad should be a short description of the product or service. The ad contains only texts`,
                modelClass: ModelClass.SMALL
            });
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] Generated AI response:", aiResponse);

            // Compose final response
            const finalResponse = composeTwitterResponse(aiResponse, ad);
            elizaLogger.debug("[GET_RESPONSE_WITH_AD] Final composed response:", finalResponse);

            elizaLogger.success(`Successfully generated response with ad`);

            callback({
                text: finalResponse,  // Changed from aiResponse to finalResponse
                action: "GET_RESPONSE_WITH_AD",
                intent: "HELP"
            });
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

function composeTwitterResponse(aiResponse: string, ad: any): string {

    console.log("ad", ad);
    console.log("aiResponse", aiResponse);
    // Calculate available space for response after ad

    const maxResponseLength = TWITTER_MAX_LENGTH - ad.length - 10; // 10 chars buffer

    // Truncate AI response if needed
    let truncatedResponse = aiResponse;


    console.log("truncatedResponse", truncatedResponse);

    console.log("ad", ad);

    console.log("in the end", `${truncatedResponse} \n\n${ad}`);

    return `${truncatedResponse} \n\n${ad}`;
}

