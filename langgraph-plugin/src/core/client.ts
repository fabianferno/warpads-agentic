import { warpadsTool } from "../tools";
import { createCDPTools } from "../tools/CDPTools";

type WarpadsConfig = {
  apiKey: string;
};

export class Warpads {
  constructor(private readonly config: WarpadsConfig) {}

  async getTools() {
    return warpadsTool;
  }

  getCDPTools() {
    return createCDPTools(this.config.apiKey);
  }
}

export class WarpadsError extends Error {
  constructor(message: string) {
    super(`[Warpads] ${message}`);
    this.name = "WarpadsError";
  }
}
