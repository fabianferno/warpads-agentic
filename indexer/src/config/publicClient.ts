import { createPublicClient, http } from "viem";
import { flowTestnet } from "viem/chains";

export const flowPublicClient = createPublicClient({
  chain: flowTestnet,
  transport: http(),
});
