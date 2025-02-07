import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.string().min(1),
  PORT: z.string().default("3000"),
  ALCHEMY_API_KEY: z.string().min(1),
  PINATA_JWT: z.string().min(1),
  PINATA_GATEWAY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  COOKIE_API_KEY: z.string().min(1),
  OPERATOR_PRIVATE_KEY: z.string().min(1),
  SKYVERN_API_KEY: z.string().min(1),
  OPERATOR_KEY: z.string().min(1),
});

const env = envSchema.parse(process.env);

export { env };
