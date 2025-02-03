'use client'

import { motion } from "framer-motion";
import { CloudUploadIcon, LockIcon, ServerIcon } from "lucide-react";

import Tweets from "@/components/sections/Tweets";


const features = [
    {
        name: "For Developers",
        description:
            "Integrate WarpAds in 3 lines of code—start earning from day one.",
        icon: CloudUploadIcon,
    },
    {
        name: "For Advertisers",
        description:
            "Target users where they're most engaged: inside AI conversations.",
        icon: LockIcon,
    },
    {
        name: "Smart Adaptation",
        description:
            "Our AI-powered system automatically optimizes ad placement and targeting for maximum engagement.",
        icon: ServerIcon,
    },
];



export default function CallToValue() {
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
                        Earn More with Ads That Adapt to Your Users&apos; Needs
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-6 text-lg/8 text-gray-300"
                    >
                        Unlock a decentralized, transparent, and fair advertising system
                        tailored for Web3 social platforms. Empower creators,
                        advertisers, and communities to take control of digital
                        advertising.
                    </motion.p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative -z-20 min-w-full max-w-xl rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-[64rem] lg:max-w-none"
                >
                    <Tweets />
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
