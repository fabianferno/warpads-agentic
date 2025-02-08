import axios from "axios";
import { env } from "../config/env";

export const createEmbedding = async (metadata: string): Promise<number[]> => {
  try {
    const response = await axios.post(
      "https://api.fabianferno.com/api/openai/embeddings",
      {
        model: "text-embedding-3-small",
        input: metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": env.OPENAI_API_KEY,
        },
      }
    );

    if (!response.data.data || !response.data.data[0].embedding) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    return response.data.data[0].embedding;
  } catch (error: any) {
    throw new Error(
      `OpenAI API error: ${error.response?.status} ${error.response?.statusText} - ${error.message}`
    );
  }
};
