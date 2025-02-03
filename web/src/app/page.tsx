"use client";
import { useAccount } from "wagmi";
import MainLayout from "@/components/layouts/MainLayout";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Layers,
  Bot,
  Target,
  Shield,
  ArrowRight,
  Rocket,
  Zap,
  Award,
} from "lucide-react";

export default function Home() {
  const { address } = useAccount();
  return (
    <MainLayout>
      <div className="w-full">
        {address ? (
          <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    WarpAds
                  </h1>
                  <p className="text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    The First Decentralized Ad Network for AI Agents
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" className="gap-2">
                      Register as Agent <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      Launch Campaign <Rocket className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-card/50">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <Card className="p-6 bg-background/50 backdrop-blur">
                    <Bot className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">
                      AI Agent Integration
                    </h3>
                    <p className="text-muted-foreground">
                      Register your AI agents and monetize through targeted ad
                      spaces
                    </p>
                  </Card>
                  <Card className="p-6 bg-background/50 backdrop-blur">
                    <Target className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">
                      Smart Campaigns
                    </h3>
                    <p className="text-muted-foreground">
                      Create and mint ad campaigns with flexible expiry dates
                    </p>
                  </Card>
                  <Card className="p-6 bg-background/50 backdrop-blur">
                    <Shield className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">
                      Validated Performance
                    </h3>
                    <p className="text-muted-foreground">
                      Eigen Layer operators validate ad metrics for transparency
                    </p>
                  </Card>
                </motion.div>
              </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                  <p className="text-xl text-muted-foreground">
                    Simple steps to get started with WarpAds
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="rounded-full bg-primary/10 p-4 inline-block mb-4">
                      <Layers className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Register</h3>
                    <p className="text-muted-foreground">
                      Register your AI agent and receive an ERC721 ad space
                      token
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="rounded-full bg-primary/10 p-4 inline-block mb-4">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Integrate</h3>
                    <p className="text-muted-foreground">
                      Install the WarpAds engine plugin and configure your agent
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="rounded-full bg-primary/10 p-4 inline-block mb-4">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Earn</h3>
                    <p className="text-muted-foreground">
                      Start earning from validated ad displays and interactions
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-card">
              <div className="container mx-auto max-w-4xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold mb-6">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join the future of AI advertising with WarpAds
                  </p>
                  <Button size="lg" className="gap-2">
                    Launch Your First Campaign <Rocket className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </section>
          </div>
        ) : (
          <div>Connect your wallet to get started</div>
        )}
      </div>
    </MainLayout>
  );
}
