'use client'

import { motion } from "framer-motion";
import { Target, Zap, Diamond, ArrowRight } from "lucide-react";

const benefits = [
    {
        feature: "Model Context Protocol (MACP)",
        benefit: "Ads adapt to user intent—no more guessing.",
        details: "Our AI understands conversation context in real-time, ensuring ads feel natural and relevant.",
        icon: Target,
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        feature: "Permissionless Ad Auctions",
        benefit: "Anyone can bid for ad space, creating fair competition and higher payouts.",
        details: "Decentralized marketplace ensures transparency and maximizes value for all participants.",
        icon: Zap,
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        feature: "Incentive-Aligned Metrics",
        benefit: "Earn more when users engage—we profit only when you do.",
        details: "Revolutionary reward system that perfectly aligns advertiser, publisher, and user interests.",
        icon: Diamond,
        color: "from-emerald-500/20 to-teal-500/20"
    }
];

export default function Vision() {
    return (
        <div className="relative overflow-hidden bg-[#0B1120] py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Problem Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4">
                                The Challenge
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Current State of AI Advertising
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                AI agents struggle to monetize without disrupting user trust or experience.
                                Generic ads ruin AI interactions, users hate irrelevance, advertisers waste
                                budgets, and developers lose revenue.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Disrupted user experiences
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Ineffective ad targeting
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Lost revenue opportunities
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Solution Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                                Our Solution
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Context-Aware AI Advertising
                            </h3>
                            <p className="text-gray-400 text-lg mb-6">
                                WarpAds uses LLM-powered context to serve ads that feel like helpful
                                suggestions, not interruptions.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    For Users: Ads match their real-time needs
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    For Agents: Earn rewards via the open-auction protocol
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                                    </span>
                                    For Advertisers: Target high-intent moments
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-16"
                >
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                            Key Benefits
                        </span>
                        <h3 className="text-3xl font-bold text-white">
                            Why Choose WarpAds?
                        </h3>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {benefits.map((item, index) => (
                            <motion.div
                                key={item.feature}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10 hover:ring-2 hover:ring-cyan-500/50 transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 mb-6">
                                        <item.icon className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-white mb-2">
                                        {item.feature}
                                    </h4>
                                    <p className="text-gray-400 mb-4">
                                        {item.benefit}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.details}
                                    </p>
                                    <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300">
                                        <span className="text-sm font-semibold">Learn more</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>


            </div>
        </div>
    );
}
