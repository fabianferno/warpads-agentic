"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { X, Loader2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import axios from "axios";
import { PinataSDK } from "pinata-web3";
import { chainLogos } from "@/lib/chainLogos";
import TimeSeriesGraph from "../TimeGraph";

export default function MyAds() {
  const [active, setActive] = useState<any>(null);
  const [ads, setads] = useState<any[]>([]);
  const [adsWithImages, setadsWithImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContract, isPending: isClaimPending } = useWriteContract();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    const fetchads = async () => {
      try {
        setIsLoading(true);
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const response = await axios.get(`${API_BASE_URL}/get-my-ads`, {
          params: { address: address },
        });
        const data = response.data;
        console.log("Fetched ads:", data);
        setads(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
        toast.error("Failed to fetch ads");
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchads();
    }
  }, [address]);
  function combineLowHigh(
    low: number,
    high: number,
    unsigned: boolean
  ): bigint {
    let lowBigInt = BigInt(low);
    let highBigInt = BigInt(high) << BigInt(32);
    let value = highBigInt | (lowBigInt & BigInt(0xffffffff)); // Mask to handle negatives properly

    return unsigned ? value : BigInt.asIntN(64, value); // Convert to signed if needed
  }

  useEffect(() => {
    const fetchImages = async () => {
      const updatedads = await Promise.all(
        ads.map(async (agent) => {
          try {
            const pinata = new PinataSDK({
              pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
              pinataGateway:
                process.env.NEXT_PUBLIC_PINATA_GATEWAY ||
                "orange-select-opossum-767.mypinata.cloud",
            });
            const { data: imageURL, contentType } = await pinata.gateways.get(
              agent.metadata.imageHash
            );
            console.log(imageURL);
            const blobUrl = URL.createObjectURL(
              new Blob([imageURL as Blob], { type: contentType || "image/png" })
            );

            return { ...agent, imageURL: blobUrl || "/placeholder.svg" };
          } catch (error) {
            console.error(
              `Failed to fetch image for agent ${agent.id}:`,
              error
            );
            return { ...agent, imageURL: "/placeholder.svg" };
          }
        })
      );
      console.log(updatedads);
      setadsWithImages(updatedads);
    };

    if (ads.length > 0) {
      fetchImages();
    }
  }, [ads]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <MainLayout>
      <div className="relative isolate min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 md:p-8">
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

        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-start border-b border-cyan-500/50 pb-4">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
              My ads
            </h1>
            <p className="text-slate-400">View your ads and manage them</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
              <p className="text-slate-400">Loading your ads...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
              <Users className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                No ads Found
              </h3>
              <p className="text-slate-400 text-center max-w-md">
                You don't have any ads yet. Create your first agent to get
                started with automated trading.
              </p>
            </div>
          ) : adsWithImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
              <p className="text-slate-400">Loading agent images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adsWithImages.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer hover:shadow-lg backdrop-blur-xl bg-slate-900/50 border-slate-800/50 ring-1 ring-white/10 transition-all duration-300 hover:ring-cyan-500/30"
                  onClick={() => setActive(agent)}
                >
                  <Image
                    width={400}
                    height={200}
                    src={agent.imageURL || "/placeholder.svg"}
                    alt={agent.metadata.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {agent.metadata.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                          {agent.insights?.length || 0} views
                        </span>
                        <Image
                          width={20}
                          height={20}
                          src={chainLogos[agent.chainId]}
                          alt="chain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {agent.metadata.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.metadata.categories?.map((category: string) => (
                        <span
                          key={category}
                          className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  ref={ref}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-900 rounded-lg shadow-lg p-6 max-w-6xl w-full mx-4 ring-1 ring-white/10"
                >
                  <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setActive(null)}
                  >
                    <X size={24} />
                  </button>

                  <div className="flex gap-6">
                    {/* Left side content */}
                    <div className="flex-1">
                      <Image
                        width={400}
                        height={200}
                        src={active.imageURL || "/placeholder.svg"}
                        alt={active.metadata.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <h3 className="mt-4 text-xl font-bold text-white">
                        {active.metadata.name}
                      </h3>
                      <p className="text-slate-400 mt-2">
                        {active.metadata.description}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Owner: {active.owner}
                      </p>
                      <div className="mt-4">
                        <p className="text-sm text-slate-400 mb-2">
                          Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {active.metadata.categories?.map(
                            (category: string) => (
                              <span
                                key={category}
                                className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300"
                              >
                                {category}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-4">
                        Total Views: {active.insights?.length || 0}
                      </p>
                    </div>

                    {/* Right side chart */}
                    <div className="flex-1 border-l border-slate-800 pl-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        View Analytics
                      </h4>
                      <div className="h-[400px]">
                        <TimeSeriesGraph data={active.insights} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
