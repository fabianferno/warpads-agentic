"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Rocket, Code2, Beaker, Globe2 } from "lucide-react";

const timelineData = [
    {
        phase: "Genesis",
        title: "WarpAds - open-ads protocol for Farcaster Frames",
        date: "Q2 2024",
        status: "Completed",
        icon: Beaker,
        gradient: "from-emerald-500/20 to-cyan-500/20",
        content: {
            description: "An open display ads protocol for Farcaster, analogous to the prominence of Facebook ads. This innovative platform allows users to convert any existing Farcaster frames into a WarpAds Frame (an ad-embedded frame) and relay the frame requests to the original server without requiring any changes on the server. ",
            achievements: [
                "Won Global dAGI Hackathon Grant (10K USDC)",
            ]
        }
    },
    {
        phase: "Good news",
        title: "Winning the Gitcoin GG22 Grant",
        date: "Q4 2024",
        status: "Completed",
        icon: Code2,
        gradient: "from-blue-500/20 to-indigo-500/20",
        content: {
            description: "Recieved grants and recognition to continue development",
            achievements: [
                "Won the Gitcoin GG22 Grant (Hack Alumni), voted #1 in the by community",
            ]
        }
    },
    {
        phase: "Pivot",
        title: "WarpAds (Agentic)",
        date: "Q1 2025",
        status: "In Progress",
        icon: Rocket,
        gradient: "from-purple-500/20 to-pink-500/20",
        content: {
            description: "Pivoting to a new vision of AI-powered influencers, WarpAds (Agentic) is a new protocol that allows users to allow agent devs to monetize their AI agents and earn WADS tokens",
            achievements: [
                "Build an ad engine for agentic/LLM apps",
                "Participate in the Ethglobal Agentic Hackathon",
                "Develop SDKs and plugins",
                "Incentivized testnet version for agents",
                "Eigen layer AVS enabled incentive validation",
            ]
        }
    },
    {
        phase: "Phase 4",
        title: "Above and beyond",
        date: "Q2 2025",
        status: "In Progress",
        icon: Globe2,
        gradient: "from-orange-500/20 to-red-500/20",
        content: {
            description: "Full-scale launch of WarpAds platform with enterprise partnerships and global rollout",
            achievements: [
                "Multi-chain payment support",
                "Enterprise-grade analytics dashboard",
                "AI model optimization v2.0",
                "Partner with existing ad networks like Monetag, Facebook Ads, Google Ads to aggregate ad revenue for agents",
                "24/7 support infrastructure"
            ]
        }
    }
];

const Timeline = () => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (ref.current) {
                // Calculate height excluding the last item's padding
                const lastItemHeight = ref.current.lastElementChild?.clientHeight || 0;
                const totalHeight = ref.current.getBoundingClientRect().height - lastItemHeight;
                setHeight(totalHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div className="relative bg-[#0B1120] py-24" ref={containerRef}>
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                        Looking back, and looking forward
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Here's our Roadmap
                    </h2>
                </motion.div>

                <div ref={ref} className="relative">
                    {timelineData.map((item, index) => (
                        <motion.div
                            key={item.phase}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative flex gap-8 pb-24 last:pb-0"
                        >
                            {/* Timeline Line */}
                            {index < timelineData.length - 1 && (
                                <div className="absolute left-[27px] top-0 h-full w-px bg-gray-800">
                                    <motion.div
                                        style={{
                                            height: heightTransform,
                                            opacity: opacityTransform,
                                        }}
                                        className="absolute inset-0 w-full bg-gradient-to-b from-cyan-500 to-transparent"
                                    />
                                </div>
                            )}

                            {/* Timeline Node */}
                            <div className="relative flex min-w-[56px] justify-center pt-3">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`h-14 w-14 rounded-full border-2 ${item.status === "Completed"
                                        ? "border-cyan-500 bg-cyan-500/10"
                                        : item.status === "In Progress"
                                            ? "border-yellow-500 bg-yellow-500/10"
                                            : "border-gray-700 bg-gray-700/10"
                                        } flex items-center justify-center transition-colors duration-200`}
                                >
                                    <item.icon className={`h-6 w-6 ${item.status === "Completed"
                                        ? "text-cyan-500"
                                        : item.status === "In Progress"
                                            ? "text-yellow-500"
                                            : "text-gray-700"
                                        }`} />
                                </motion.div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1">
                                <motion.div
                                    whileHover={{ translateY: -5 }}
                                    className={`flex flex-col rounded-2xl bg-gradient-to-br ${item.gradient} p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-2 hover:ring-cyan-500/50`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "Completed"
                                                    ? "bg-cyan-500/10 text-cyan-400"
                                                    : item.status === "In Progress"
                                                        ? "bg-yellow-500/10 text-yellow-400"
                                                        : "bg-gray-700/10 text-gray-400"
                                                    }`}>
                                                    {item.status}
                                                </span>
                                                <p className="text-sm text-cyan-500 font-semibold">
                                                    {item.phase}
                                                </p>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-800 text-gray-300">
                                            {item.date}
                                        </span>
                                    </div>

                                    <p className="text-gray-300 mb-6 text-lg">
                                        {item.content.description}
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        {item.content.achievements.map((achievement, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="flex items-center gap-2 text-sm text-gray-300 bg-slate-900/50 rounded-lg p-2"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                                {achievement}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;