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
        "HELP", "TELL", "SHOW", "EXPLAIN", "GUIDE", "LEARN", "ADVICE", "RECOMMEND", "SUGGEST",
        "TEACH", "TIPS", "HOW TO", "LEARN_ABOUT", "UNDERSTAND", "MASTER", "IMPROVE",
        "BEST_WAY", "START", "BEGIN", "PRACTICE", "STUDY", "TRAIN", "DEVELOP",
        "RESOURCES", "TOOLS", "COURSES", "TUTORIALS", "GUIDE ME", "NEED_HELP",
        "WHERE_TO_START", "GET_BETTER", "ENHANCE", "UPGRADE", "LEVEL_UP",
        // Add catch-all similes to ensure it triggers
        "NONE", "DEFAULT"
    ],
    description: "Get a response augmented with a relevant advertisement.",
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    shouldHandle: async (_runtime: IAgentRuntime, message: Memory) => {
        // Always handle the message
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
            const userMessage =message.content.text || "";

            console.log("message", message.content.text);

            console.log("userMessage", userMessage);

            const adService = createAdService();

            
            const { ad } = await adService.getRelevantAd(userMessage);

            console.log("ad", ad);

            // Generate AI response first
            const aiResponse = await generateText({
                runtime,
                context: `Generate a helpful and concise response for: ${message.content.text}. Keep it informative but brief enough to fit in a tweet with an ${ad}. The ad should be a short description of the product or service. The ad contains only texts`,
                modelClass: ModelClass.MEDIUM
            });
            
            console.log("aiResponse", aiResponse);  
            // Get ad from external service

            // Compose final response
            const finalResponse = composeTwitterResponse(aiResponse, ad);

            console.log("finalResponse", finalResponse);

            elizaLogger.success(`Successfully generated response with ad`);

            callback({
                text: aiResponse,
                action: "GET_RESPONSE_WITH_AD",
                intent: "HELP" // Add default intent
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

