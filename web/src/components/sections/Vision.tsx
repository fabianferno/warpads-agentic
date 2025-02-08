'use client'

import { motion } from "framer-motion";
import { Target, Zap, Diamond, ArrowRight } from "lucide-react";
import Link from "next/link";


const benefits = [
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
        <div className="relative overflow-hidden bg-[#0B1120] py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />


            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid gap-8 md:grid-cols-2">
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
                                    <Link href="/docs" className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300">
                                        <span className="text-sm font-semibold">Learn more</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
