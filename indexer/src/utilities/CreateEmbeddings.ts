import { env } from "../config/env";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const createEmbedding = async (metadata: any) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: metadata,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
};
