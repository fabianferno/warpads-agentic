'use client'

import { motion } from "framer-motion";
import { ArrowRight, Brain, Globe2, Users } from "lucide-react";
import Link from "next/link";
import NavSection from "@/components/sections/NavSection";
import Footer from "@/components/sections/Footer";

const teamValues = [
    {
        title: "Innovation First",
        description: "Pushing the boundaries of AI advertising with cutting-edge technology",
        icon: Brain,
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "User-Centric",
        description: "Building with user experience and privacy at the forefront",
        icon: Users,
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Global Impact",
        description: "Creating solutions that scale across borders and platforms",
        icon: Globe2,
        gradient: "from-emerald-500/20 to-teal-500/20"
    }
];

const milestones = [
    {
        quarter: "Q3 2024",
        title: "The Beginning",
        description: "WarpAds was conceived as a solution to the growing disconnect between AI platforms and advertising",
        status: "Completed"
    },
    {
        quarter: "Q4 2024",
        title: "Innovation & Growth",
        description: "Launched our core protocol and established key partnerships in the AI industry",
        status: "Completed"
    },
    {
        quarter: "Q1 2025",
        title: "Global Expansion",
        description: "Scaling our solution globally with enterprise adoption and enhanced features",
        status: "In Progress"
    }
];

export default function About() {
    return (
        <div className="relative min-h-screen bg-[#0B1120]">
            <NavSection />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Hero Section */}
            <div className="h-24" />
            <div className="relative pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                            Our Story
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Revolutionizing the Future of
                            <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                                AI Advertising
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
                            WarpAds is building the bridge between AI platforms and meaningful advertising,
                            creating value for users, developers, and advertisers alike.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="relative py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                                Our Mission
                            </span>
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Building the Future of Digital Advertising
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                We're on a mission to transform how AI platforms monetize while maintaining user trust and experience.
                                Through our innovative Model Context Protocol, we're creating a new standard for contextual advertising
                                that benefits everyone in the ecosystem.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Values Section */}
            <div className="relative py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                            Our Values
                        </span>
                        <h2 className="text-3xl font-bold text-white">
                            What Drives Us Forward
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {teamValues.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl bg-slate-900/50 p-8 ring-1 ring-white/10 hover:ring-2 hover:ring-cyan-500/50 transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 mb-6">
                                        <value.icon className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400">
                                        {value.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Updated Milestones Section */}
            <div className="relative py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                            Our Journey
                        </span>
                        <h2 className="text-3xl font-bold text-white">
                            Key Milestones
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[50%] top-0 h-full w-px bg-slate-800" />

                        <div className="space-y-16">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.quarter}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                                        }`}
                                >
                                    {/* Timeline node */}
                                    <div className="absolute left-[50%] -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 ring-2 ring-cyan-500" />

                                    {/* Content card */}
                                    <div className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'pr-8' : 'pl-8'
                                        }`}>
                                        <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-6 ring-1 ring-white/10">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-50" />
                                            <div className="relative">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm font-medium text-cyan-400">
                                                        {milestone.quarter}
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${milestone.status === "Completed"
                                                        ? "bg-cyan-500/10 text-cyan-400"
                                                        : milestone.status === "In Progress"
                                                            ? "bg-yellow-500/10 text-yellow-400"
                                                            : "bg-slate-500/10 text-slate-400"
                                                        }`}>
                                                        {milestone.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {milestone.title}
                                                </h3>
                                                <p className="text-gray-400">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-900/50 p-12 ring-1 ring-white/10 text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Join Us in Shaping the Future
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                Be part of the revolution in AI advertising. Whether you're a developer,
                                advertiser, or platform owner, there's a place for you in our ecosystem.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
} 