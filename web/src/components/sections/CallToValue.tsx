'use client'

import { motion } from "framer-motion";
import { UploadIcon, LockIcon, ServerIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const plugins = [
    {
        name: "ElizaOS",
        image: "/assets/Plugin1.png",
    },
    {
        name: "LangChain",
        image: "/assets/Plugin2.jpg",
    },
]

const features = [
    {
        name: "For Developers",
        description:
            "Monetize agents instantly with 3 lines of code. Seamless integration with top frameworks (Eliza, CrewAI, LangGraph)—no UX compromises, just passive revenue.",
        icon: UploadIcon,
    },
    {
        name: "For Advertisers",
        description:
            "Unlock 1,500+ AI \"influencers\" (10k+ daily users) with hyper-targeted, conversational ads. Reach niche audiences—coding assistants, travel planners, shopping agents—using AI-native intent signals for unmatched relevance.",
        icon: LockIcon,
    },
    {
        name: "For Users",
        description:
            "Ads that add value, not clutter. Contextual recommendations blend naturally into agent interactions.",
        icon: ServerIcon,
    },
];

export default function CallToValue() {
    const [activeTab, setActiveTab] = useState(0);
    const timerRef = useRef<NodeJS.Timeout>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const startTimer = () => {
            timerRef.current = setInterval(() => {
                setActiveTab((prev) => (prev + 1) % plugins.length);
            }, 4000);
        };

        startTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % plugins.length);
        }, 4000);
    };

    return <div className="mx-auto max-w-full sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:row-start-2 lg:max-w-md"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                    >
                        Get started in 3 lines of code; Yes, it's that easy
                    </motion.h2>
                </motion.div>
                <motion.div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative min-w-full max-w-xl rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4  lg:max-w-none"
                >
                    <div className="flex flex-col items-end justify-start">
                        <div className="flex flex-row justify-start gap-4 mb-4 relative z-10">
                            {plugins.map((plugin, index) => (
                                <Button
                                    variant={activeTab === index ? "ghost" : "outline"}
                                    key={plugin.name}
                                    onClick={() => setActiveTab(index)}
                                    className={`text-xl font-semibold transition-colors duration-200 cursor-pointer ${activeTab === index ? 'text-cyan-500' : 'text-white/70 bg-transparent hover:text-white'}`}
                                >
                                    {plugin.name}
                                </Button>
                            ))}
                        </div>
                        <div className="relative w-full h-[50vh]">
                            {plugins.map((plugin, index) => (
                                <motion.div
                                    key={plugin.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: activeTab === index ? 1 : 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        visibility: activeTab === index ? 'visible' : 'hidden'
                                    }}
                                    className="text-center"
                                >
                                    <Image
                                        src={plugin.image}
                                        className="rounded-xl object-cover"
                                        alt={plugin.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10"
                >
                    <dl className="max-w-xl space-y-8 text-base/7 text-gray-300 lg:max-w-none">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                className="relative"
                            >
                                <dt className="ml-9 inline-block font-semibold text-white">
                                    <feature.icon
                                        aria-hidden="true"
                                        className="absolute left-1 top-1 size-5 text-cyan-500"
                                    />
                                    {feature.name}
                                </dt>{" "}
                                <dd className="inline">{feature.description}</dd>
                            </motion.div>
                        ))}
                    </dl>
                </motion.div>
            </div>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-12 top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl lg:bottom-[-12rem] lg:top-auto lg:translate-y-0 lg:transform-gpu"
            >
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-cyan-400 opacity-25"
                />
            </div>
        </div>
    </div>
}
