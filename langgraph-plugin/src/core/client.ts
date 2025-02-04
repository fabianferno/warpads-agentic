import { warpadsTool } from "../tools";

type WarpadsConfig = {
  apiKey: string;
};

type WeatherData = {
  temp: number;
  humidity: number;
  condition: string;
};

export class Warpads {
  constructor(private readonly config: WarpadsConfig) {}

  async getTools() {
    return warpadsTool;
  }
}

export class WarpadsError extends Error {
  constructor(message: string) {
    super(`[Warpads] ${message}`);
    this.name = "WarpadsError";
  }
}
