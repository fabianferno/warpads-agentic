import {
  GET_AD_PROMPT_INPUT,
  GET_AD_PROMPT,
  createWarpAdsTool,
} from "./WarpAdsTool";
import {
  TRACK_AD_PROMPT,
  TRACK_AD_PROMPT_INPUT,
  createAdTrackerTool,
} from "./AdTrackerTool";

export function createCDPTools(apiKey: string) {
  return {
    getAdTool: {
      name: "getAdTool",
      description: GET_AD_PROMPT,
      func: createWarpAdsTool(apiKey),
      argsSchema: GET_AD_PROMPT_INPUT,
    },
    trackAdTool: {
      name: "trackAdTool",
      description: TRACK_AD_PROMPT,
      func: createAdTrackerTool(apiKey),
      argsSchema: TRACK_AD_PROMPT_INPUT,
    },
  };
}
