'use client'

import HeroWrapper from "@/components/sections/HeroWrapper";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

export default function HeroSection() {
    return <HeroWrapper>
        <div className="relative isolate pt-14">
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

            <div className="py-20 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-8 flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-5 py-2 ring-1 ring-inset ring-cyan-500/20">
                                <Sparkles className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium text-cyan-400">
                                    Revolutionizing AI Advertising
                                </span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0.5, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
                        >
                            <span className="block mb-4">The Open Protocol for</span>
                            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                                Next-Gen Advertising
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-8 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
                        >
                            WarpAds seamlessly connects AI agents with relevant ads that users actually want to engage with. 
                            Boost revenue while maintaining trust and alignment across the ecosystem.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                size="lg"
                                className="bg-cyan-500 text-slate-950 font-semibold hover:opacity-90 hover:bg-cyan-600 hover:text-white px-8 h-12 text-base w-full sm:w-auto transition-all duration-300"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="bg-slate-800/40 text-slate-300 hover:bg-slate-800/60 hover:text-white px-8 h-12 text-base w-full sm:w-auto group flex items-center gap-2 transition-all duration-300 ring-1 ring-slate-700/50 hover:ring-cyan-500/30"
                            >
                                <FileText className="h-4 w-4" />
                                Documentation
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-500 to-cyan-300 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
            </div>
        </div>
    </HeroWrapper>
}