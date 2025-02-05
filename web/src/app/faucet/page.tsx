"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Droplets, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { publicClient, walletClient } from "@/lib/config";
import { contractsConfig } from "@/lib/const";
import { WARP_TOKEN_ABI } from "@/lib/abi/WarpToken";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { isAddress } from "viem";
import MainLayout from "@/components/layouts/MainLayout";

// Configuration constants
const MINT_AMOUNT = BigInt(10e18); // 10 tokens
const BLOCK_EXPLORER_URL = "https://sepolia.etherscan.io/tx/";

export default function FaucetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(true);
  const { address: accountAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Check if approval is needed
  useEffect(() => {
    const checkAllowance = async () => {
      if (!accountAddress) return;

      try {
        const allowance = (await publicClient.readContract({
          address: contractsConfig[chainId].warpTokenAddress,
          abi: WARP_TOKEN_ABI,
          functionName: "allowance",
          args: [accountAddress, contractsConfig[chainId].warpadsAddress],
        })) as bigint;

        setNeedsApproval(allowance < MINT_AMOUNT);
      } catch (error) {
        console.error("Error checking allowance:", error);
      }
    };

    checkAllowance();
  }, [accountAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!accountAddress || !isAddress(accountAddress)) {
      toast.error("Invalid wallet address");
      return;
    }

    setIsLoading(true);
    try {
      // Mint tokens
      const tx = await walletClient.writeContract({
        address: contractsConfig[chainId].warpTokenAddress,
        abi: WARP_TOKEN_ABI,
        functionName: "mint",
        args: [accountAddress, MINT_AMOUNT],
        account: accountAddress,
      });

      toast.promise(publicClient.waitForTransactionReceipt({ hash: tx }), {
        loading: "Minting tokens...",
        success: (
          <div>
            Tokens minted successfully!
            <a
              href={`${BLOCK_EXPLORER_URL}${tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              View transaction <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ),
        error: "Failed to mint tokens",
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      setIsLoading(false);

      // Only proceed with approval if needed
      if (needsApproval) {
        setIsApproving(true);
        const approveTx = await walletClient.writeContract({
          address: contractsConfig[chainId].warpTokenAddress,
          abi: WARP_TOKEN_ABI,
          functionName: "approve",
          args: [contractsConfig[chainId].warpadsAddress, MINT_AMOUNT],
          account: accountAddress,
        });

        toast.promise(
          publicClient.waitForTransactionReceipt({ hash: approveTx }),
          {
            loading: "Approving WarpAds contract...",
            success: (
              <div>
                Approval successful!
                <a
                  href={`${BLOCK_EXPLORER_URL}${approveTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View transaction <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ),
            error: "Failed to approve WarpAds contract",
          }
        );

        await publicClient.waitForTransactionReceipt({ hash: approveTx });
        setNeedsApproval(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Failed to process transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsApproving(false);
    }
  };

  console.log(isConnected);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
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
                  Get test tokens sent to your connected wallet
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    value={accountAddress || ""}
                    disabled={!isConnected}
                    placeholder="Connect your wallet to continue"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                  disabled={isLoading || isApproving || !isConnected}
                >
                  {!isConnected ? (
                    "Connect Wallet"
                  ) : isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minting Tokens...
                    </>
                  ) : isApproving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Approving WarpAds...
                    </>
                  ) : (
                    "Request Tokens"
                  )}
                </Button>

                <div className="mt-4 text-center text-sm text-gray-400">
                  <p>Maximum request: 10 Warp per day</p>
                  <p className="mt-1">
                    Please allow a few moments for the transactions to process
                  </p>
                  {needsApproval && (
                    <p className="mt-1 text-yellow-400">
                      Note: This will require two transactions - mint and
                      approve
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
