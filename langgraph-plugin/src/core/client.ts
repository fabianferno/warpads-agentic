import { createCDPTools } from "../tools/CDPTools";

type WarpadsConfig = {
  apiKey: string;
};

export class Warpads {
  constructor(private readonly config: WarpadsConfig) {}

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
