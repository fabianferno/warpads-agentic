"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Droplets } from "lucide-react";
import { toast } from "sonner";
import { publicClient, walletClient } from "@/lib/config";
import { WARP_TOKEN_ADDRESS, WARPADS_ADDRESS } from "@/lib/const";
import { WARP_TOKEN_ABI } from "@/lib/abi/WarpToken";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function FaucetForm() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { address: accountAddress } = useAccount();
  console.log(accountAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      console.error("Please enter an address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const tx = await walletClient.writeContract({
        address: WARP_TOKEN_ADDRESS,
        abi: WARP_TOKEN_ABI,
        functionName: "mint",
        args: [address, BigInt(10e18)],
        account: accountAddress as `0x${string}`,
      });
      console.log(tx);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      setIsLoading(false);
      setIsApproving(true);

      // Approve the contract to spend the tokens
      const approveTx = await walletClient.writeContract({
        address: WARP_TOKEN_ADDRESS,
        abi: WARP_TOKEN_ABI,
        functionName: "approve",
        args: [WARPADS_ADDRESS, BigInt(10e18)],
        account: accountAddress as `0x${string}`,
      });

      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTx,
      });

      console.log(receipt);
      setIsApproving(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send tokens. Please try again.");
    } finally {
      setIsLoading(false);
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <ConnectButton />
        <Card className="backdrop-blur-xl bg-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Token Faucet
              </h1>
              <p className="text-gray-300 text-center">
                Request test tokens by entering your address below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your wallet address (0x...)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Tokens...
                  </>
                ) : isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Request Tokens"
                )}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Maximum request: 10 Warp per day</p>
                <p className="mt-1">
                  Please allow a few moments for the transaction to process
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
