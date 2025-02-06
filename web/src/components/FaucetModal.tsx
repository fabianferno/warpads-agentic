"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Droplets, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { isAddress, formatEther } from "viem";
import { contractsConfig } from "@/lib/const";
import { WARP_TOKEN_ABI } from "@/lib/abi/WarpToken";
import { useAccount, useChainId, useWriteContract, useWatchContractEvent, useContractRead } from "wagmi";
import { addTokenToWallet } from "@/lib/addTokenToWallet";

// Configuration constants
const MINT_AMOUNT = BigInt(10e18); // 10 tokens

export default function FaucetModal() {
    const [isLoading, setIsLoading] = useState(false);
    const chainId = useChainId();
    const { address } = useAccount();
    const { writeContract, isPending: isMinting, error: mintError } = useWriteContract();

    // Get token balance
    const { data: balance } = useContractRead({
        address: contractsConfig[chainId]?.warpTokenAddress,
        abi: WARP_TOKEN_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
    }) as { data: bigint | undefined };

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

    const formattedBalance = Number(formatEther(balance || BigInt(0))).toFixed(2);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden bg-zinc-900/50 backdrop-blur-xl border-slate-800/50 ring-1 ring-white/10 md:flex items-center gap-2"
                >
                    <Droplets className="w-4 h-4" />
                    <span>{formattedBalance} WARP</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900/50 backdrop-blur-xl border-slate-800/50 ring-1 ring-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 justify-center text-2xl">
                        <Droplets className="w-6 h-6 text-cyan-400" />
                        <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                            WARP Token Faucet
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            value={address || ""}
                            disabled={true}
                            placeholder="Connect your wallet to continue"
                            className="bg-slate-800/40 border-slate-700/50 text-white placeholder:text-slate-500 ring-1 ring-slate-700/50 focus:ring-cyan-500/30"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:text-white font-semibold transition-all duration-300"
                        disabled={isLoading || isMinting}
                    >
                        {isMinting ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Confirm in Wallet...
                            </div>
                        ) : (
                            "Request Tokens"
                        )}
                    </Button>

                    <div className="text-center text-sm text-slate-400">
                        <p>Maximum request: 10 Warp per day</p>
                        <p className="mt-1">
                            Please allow a few moments for the transaction to process
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 