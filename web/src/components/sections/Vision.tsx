'use client'

import { motion } from "framer-motion";
import { Target, Zap, Diamond, ArrowRight } from "lucide-react";

const benefits = [
    {
        feature: "Agent Integration",
        benefit: "Get started with WarpAds in three simple steps",
        details: "Register for an API key, install our plugin, and stake WARP tokens to start earning.",
        icon: Target,
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        feature: "Ad Campaign Management",
        benefit: "Create and manage campaigns as tradeable NFTs",
        details: "Set campaign parameters, pay fees based on duration and priority, and track engagement metrics.",
        icon: Zap,
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        feature: "Validation & Operations",
        benefit: "Decentralized validation with LLM compute",
        details: "Operators validate engagement and calculate incentives, with upcoming EigenLayer integration.",
        icon: Diamond,
        color: "from-emerald-500/20 to-teal-500/20"
    }
];

export default function Vision() {
    return (
        <div className="relative overflow-hidden bg-[#0B1120] py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Problem-Agitation-Solution Section */}
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid gap-6 md:grid-cols-3"
                >
                    <div className="text-gray-300 text-4xl">
                        Traditional ads <span className=" text-cyan-300">disrupt the seamless flow</span> of AI experiences, making monetization <span className="text-cyan-300">clunky for developers</span> and <span className="text-cyan-300">ineffective for advertisers</span>.
                    </div>

                    {/* Agitation */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                                The Challenge
                            </span>
                            <p className="text-gray-300">
                                Outdated ad systems interrupt user engagement and waste advertising dollars—hindering innovation and diluting user trust in modern AI platforms.
                            </p>
                        </div>
                    </div>

                    {/* Solution */}
                    <div className="text-gray-300 text-4xl text-end">
                        Integrate in 3 lines of code, deliver hyper-targeted conversational ads, and benefit from a transparent, decentralized ecosystem.
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
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4">
                                For Agents
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Getting Started
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Register as agent adspace to receive ERC721 token and API key
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Install WarpAds plugin and configure WARPAD_API_KEY
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 bg-slate-800/50 rounded-lg p-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Stake WARP tokens to become eligible for incentives
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
                                For Advertisers
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Campaign Creation
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
