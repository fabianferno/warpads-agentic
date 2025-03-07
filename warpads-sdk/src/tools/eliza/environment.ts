import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const warpadsEnvSchema = z.object({
  WARPADS_AGENT_KEY: z.string().min(1, "warpads API key is required"),
});

export type warpadsConfig = z.infer<typeof warpadsEnvSchema>;

export async function validateWarpadsConfig(
  runtime: IAgentRuntime
): Promise<warpadsConfig> {
  try {
    const config = {
      WARPADS_AGENT_KEY: runtime.getSetting("WARPADS_AGENT_KEY"),
    };
    console.log("config: ", config);
    return warpadsEnvSchema.parse(config);
  } catch (error) {
    console.log("error::::", error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(
        `Warpads API configuration validation failed:\n${errorMessages}`
      );
    }
    throw error;
  }
}
