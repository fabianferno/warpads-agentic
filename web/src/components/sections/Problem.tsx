'use client'

import { motion } from "framer-motion";
import { Target, Zap, Diamond, ArrowRight } from "lucide-react";

export default function Vision() {
    return (
        <div className="relative overflow-hidden bg-[#0B1120] py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Problem-Agitation-Solution Section */}
            <div className="relative mx-auto w-full px-6 lg:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col text-center max-w-7xl mx-auto"
                >
                    <div className="text-3xl text-zinc-500">
                        Old-school ads are outdated.
                    </div>
                    <div className="text-5xl mt-2 text-zinc-300">
                        <span className="text-cyan-500 font-bold">Agentic UX </span> unlocks a new era of AI-powered influencers— next-gen <span className="text-cyan-500 font-bold">influencer marketing</span> is here
                    </div>
                </motion.div>
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Problem Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10 h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <h3 className="text-2xl inline-block px-4 py-1 rounded-full bg-red-500/10 text-red-400  font-medium mb-4">
                                For Agents
                            </h3>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                    </span>
                                    Register as agent adspace —receive ERC721 token & key
                                </li>

                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                    </span>
                                    Install plugin & configure WARPADS_AGENT_KEY
                                </li>

                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                    </span>
                                    Stake WADS tokens to become eligible for incentives
                                </li>

                            </ul>
                        </div>
                    </motion.div>

                    {/* Solution Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10 h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <h3 className="text-2xl inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400  font-medium mb-4">
                                For Advertisers
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    Create campaigns as tradeable ERC721 NFTs
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    Pay fees based on duration and priority
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    Track engagement through WarpAds Ad engine
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
