"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Droplets, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { contractsConfig } from "@/lib/const";
import { WARP_TOKEN_ABI } from "@/lib/abi/WarpToken";
import { useAccount, useChainId, useWriteContract, useWatchContractEvent } from "wagmi";
import MainLayout from "@/components/layouts/MainLayout";
import { addTokenToWallet } from "@/lib/addTokenToWallet";

// Configuration constants
const MINT_AMOUNT = BigInt(10e18); // 10 tokens

export default function FaucetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();
  const { writeContract, isPending: isMinting, error: mintError } = useWriteContract();

  // Handle mint errors
  useEffect(() => {
    if (mintError) {
      console.error(mintError);
      toast.error(mintError?.message || "Failed to process transaction. Please try again.");
      setIsLoading(false);
    }
  }, [mintError]);

  // Watch for Transfer events
  useWatchContractEvent({
    address: contractsConfig[chainId]?.warpTokenAddress,
    abi: WARP_TOKEN_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      const event = logs[0];
      if (event && event.transactionHash) {
        toast.success(
          <div className="space-y-2">
            <div>Tokens minted successfully!</div>
            <div className="flex flex-col gap-2">
              <a
                href={`${contractsConfig[chainId]?.blockExplorerUrl}/tx/${event.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View transaction <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => addTokenToWallet(chainId)}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Add WARP to wallet <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
        setIsLoading(false);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contractConfig = contractsConfig[chainId];
    if (!contractConfig?.warpTokenAddress || !isAddress(contractConfig.warpTokenAddress)) {
      toast.info("Contract not deployed on this network");
      return;
    }

    setIsLoading(true);
    writeContract({
      address: contractConfig.warpTokenAddress,
      abi: WARP_TOKEN_ABI,
      functionName: "mint",
      args: [address, MINT_AMOUNT],
    });

  };

  return (
    <MainLayout>
      <div className="relative isolate min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 md:p-8 flex items-center justify-center">
        <div
          className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-20"
          aria-hidden="true"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-cyan-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="w-full max-w-[min(90vw,24rem)] space-y-4">
          <Card className="backdrop-blur-xl bg-slate-900/50 border-slate-800/50 ring-1 ring-white/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3 sm:mb-4 ring-1 ring-cyan-500/20">
                  <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                  WARP Token Faucet
                </h1>
                <p className="text-sm sm:text-base text-slate-400 text-center">
                  Get testnet tokens to use WarpAds
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Input
                    value={address || ""}
                    disabled={true}
                    placeholder="Connect your wallet to continue"
                    className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 text-sm sm:text-base h-10 sm:h-12 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:text-white h-10 sm:h-12 text-base sm:text-lg font-semibold transition-all duration-300"
                  disabled={isLoading || isMinting}
                >
                  {isMinting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Confirm in Wallet...
                    </div>
                  ) : (
                    "Request Tokens"
                  )}
                </Button>

                <div className="mt-4 text-center text-xs sm:text-sm text-slate-400">
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
    </MainLayout>
  );
}
