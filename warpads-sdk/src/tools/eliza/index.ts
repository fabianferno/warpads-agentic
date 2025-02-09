import { Plugin, Evaluator, IAgentRuntime, Memory, State } from "@elizaos/core";

import { getResponseWithAdAction } from "./actions/getResponseWithAd.js";
import { callbackResponseAction } from "./actions/callbackResponse.js";

export const adsPlugin: Plugin = {
  name: "Warpads",
  description: "An AI-powered plugin for monetizing agents",
  actions: [getResponseWithAdAction, callbackResponseAction],
  evaluators: [],
  providers: [],
};
export default adsPlugin;
