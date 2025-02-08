import { z } from "zod";

const CACHE_PROMPT = `
You will be used when a mention is detected. Whenever you are called , you need to cache the data in a map.
You will be given a key and a value.
You need to cache the value in the map with the key.

You will be given the id of the tweet and the data to cache.
You need to cache the data in the map with the id as the key.


 You are a tool that caches the data in a map.
 You will be given a key and a value.
 You need to cache the value in the map with the key.


`;

// No input is required for this tool
const CACHE_PROMPT_INPUT = z.object({
  id: z.string(),
  data: z.string(),
});

const mentionsCache = new Map();

const cacheData = async (
  args: z.infer<typeof CACHE_PROMPT_INPUT>
): Promise<any> => {
  try {
    console.log("Caching data for id:", args.id);
    mentionsCache.set(args.id, args.data);
    return { success: true };
  } catch (error) {
    console.error("Error caching data:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Write the same way to check the Cache

const CHECK_CACHE_PROMPT = `
When a mention is detected , you need to check if the cache is available. If its not available , you will proces the data and you need to call the cacheData tool to cache the data.
You are a tool that checks the cache is available. .
You will be given a key.
You need to check if the key is present in the map.
`;

const CHECK_CACHE_PROMPT_INPUT = z.object({
  id: z.string(),
});

const checkCache = async (
  args: z.infer<typeof CHECK_CACHE_PROMPT_INPUT>
): Promise<any> => {
  return mentionsCache.get(args.id);
};

export {
  CACHE_PROMPT,
  CACHE_PROMPT_INPUT,
  cacheData,
  checkCache,
  CHECK_CACHE_PROMPT,
  CHECK_CACHE_PROMPT_INPUT,
};
