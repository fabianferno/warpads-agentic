"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";

export default function MyAgents() {
  const [active, setActive] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

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

  useOutsideClick(ref, () => setActive(null));

  const handleCopy = () => {
    navigator.clipboard.writeText(active?.apiKey || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("API Key copied to clipboard");
  };

  const handleClaimReward = () => {
    toast.success(`Reward of ${active.reward} WARP claimed!`);
  };

  const cards = [
    {
      id: 1,
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      metadata: {
        name: "AI Assistant",
        description: "An AI-powered assistant for customer support.",
        tags: ["AI", "customer support"],
        image: "/assets/ai-assistant.png",
      },
      stakedValue: 5,
      active: true,
      createdAt: "2025-01-01T10:00:00.000Z",
      apiKey: "apikey1234567890",
      reward: 1.5,
    },
    {
      id: 2,
      owner: "0x4b4b30e2E7c6463b03CdFFD6c42329D357205334",
      metadata: {
        name: "Data Analyzer",
        description: "Advanced data analysis and visualization tool.",
        tags: ["data analysis", "visualization"],
        image: "/assets/data-analyzer.png",
      },
      stakedValue: 10,
      active: true,
      createdAt: "2025-02-01T09:45:28.040Z",
      apiKey: "2x34baa74e6c84d9add15ea92171183ce9",
      reward: 3.18,
    },
  ];

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
              My Agents
            </h1>
            <p className="text-slate-400">View your agents and manage them</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card
                key={card.id}
                className="cursor-pointer hover:shadow-lg backdrop-blur-xl bg-slate-900/50 border-slate-800/50 ring-1 ring-white/10 transition-all duration-300 hover:ring-cyan-500/30"
                onClick={() => setActive(card)}
              >
                <Image
                  width={400}
                  height={200}
                  src={card.metadata.image || "/placeholder.svg"}
                  alt={card.metadata.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {card.metadata.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {card.metadata.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

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
                  className="bg-slate-900 rounded-lg shadow-lg p-6 max-w-md w-full ring-1 ring-white/10"
                >
                  <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setActive(null)}
                  >
                    <X size={24} />
                  </button>
                  <Image
                    width={400}
                    height={200}
                    src={active.metadata.image || "/placeholder.svg"}
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
                  <p className="text-sm text-slate-500">
                    Staked Value: {active.stakedValue} WARP
                  </p>
                  <div className="mt-4 flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
                    <input
                      type="text"
                      readOnly
                      value={active.apiKey}
                      className="w-full bg-transparent text-sm text-slate-400 outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <Button
                    onClick={handleClaimReward}
                    className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:text-white transition-all duration-300"
                  >
                    Claim Reward ({active.reward} WARP)
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
