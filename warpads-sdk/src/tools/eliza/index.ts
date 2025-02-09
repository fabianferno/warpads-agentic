import { Plugin, Evaluator, IAgentRuntime, Memory, State } from "@elizaos/core";

import { getResponseWithAdAction } from "./actions/getResponseWithAd";
import { callbackResponseAction } from "./actions/callbackResponse";

export const adsPlugin: Plugin = {
  name: "Warpads",
  description: "An AI-powered plugin for monetizing agents",
  actions: [getResponseWithAdAction, callbackResponseAction],
  evaluators: [],
  providers: [],
};
export default adsPlugin;
