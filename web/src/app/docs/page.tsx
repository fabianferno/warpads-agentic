import { ExternalLink } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import Link from "next/link";
export default function DocsPage() {
    return (
        <MainLayout>
            <div className="relative isolate min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 md:p-8">
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

                <div className="mx-auto max-w-4xl">
                    <div className="prose prose-invert max-w-none">
                        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 text-transparent bg-clip-text">
                            WarpAds Documentation
                        </h1>

                        <div className="text-lg text-slate-300 mb-8">
                            The first decentralized ad network built for AI agents.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-3">For Developers</h3>
                                <p className="text-slate-300">
                                    Monetize agents instantly with 3 lines of code. Seamless integration with top frameworks (Eliza, CrewAI, LangGraph)—no UX compromises, just passive revenue.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-3">For Advertisers</h3>
                                <p className="text-slate-300">
                                    Unlock 1,500+ AI "influencers" (10k+ daily users) with hyper-targeted, conversational ads. Reach niche audiences—coding assistants, travel planners, shopping agents—using AI-native intent signals for unmatched relevance.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-3">For Users</h3>
                                <p className="text-slate-300">
                                    Ads that add value, not clutter. Contextual recommendations blend naturally into agent interactions.
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-300 mb-12">
                            Advertisers gain real-time analytics and dynamic bidding; developers earn effortlessly; users keep trust. Transform AI ecosystems into ethical ad channels—today.
                        </p>

                        <h2 className="text-2xl font-bold text-white mb-6">How to get started?</h2>

                        <div className="space-y-8">
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Agents</h3>
                                <p className="text-slate-300 mb-4">Agent devs can get started with the simple steps:</p>
                                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                                    <li>Register as agent adspace on the <Link target="_blank" href="/agent/register" className="text-cyan-400">Register</Link> page. This mints an ERC721 token for the agent.</li>
                                    <li>Stake some WARP tokens - this will be slashed when the ad validation fails and the agent tries to attempt a replay attack. Agent without stake will not be eligible for incentives</li>
                                    <li>Copy the generated WarpAds Agent Key</li>
                                    <li>Install the WarpAds plugin:

                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                            <li>Run <code className="bg-slate-800 px-2 py-1 rounded">npm i warpads</code></li>
                                            <li>Set the <code className="bg-slate-800 px-2 py-1 rounded">WARPADS_AGENT_KEY</code> in the env</li>
                                            <li>Import the adsPlugin:
                                                <pre className="bg-slate-800 p-2 rounded mt-1"><code>{`import {adsPlugin} from "warpads";`}</code></pre>
                                            </li>
                                            <li>Add it to the character config:

                                                <pre className="bg-slate-800 p-2 rounded mt-1"><code>export const character: Character = {"{"}
                                                    plugins: [adsPlugin],
                                                    {"}"}</code></pre>
                                            </li>
                                        </ul>
                                    </li>

                                </ol>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ad Campaigns</h3>
                                <p className="text-slate-300 mb-4">Advertisers can create campaign like this:</p>
                                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                                    <li>Create a new <Link target="_blank" href="/campaign/create" className="text-cyan-400">campaign</Link>: Each campaign is an ERC721 NFT which can be traded on any secondary marketplaces to utilize/update ad metadata. Ads are embedded and store on a vector store.</li>
                                    <li>Campaign costs are calculated based on a fixed platform fee multiplied by the campaign duration, with additional priority fees for higher visibility.</li>
                                    <li>The WarpAds Ad engine embeds ads contextually and tracks engagement for incentive distribution.</li>
                                </ol>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Validators/Operators</h3>
                                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                                    <li>Operators help with validating and incentive calculations by using LLM computer use APIs to check with the tweets and the agent's influence.</li>
                                    <li>Additionally we're working on wrapping this service over an Actively Validation Service with the Eigen Layer.</li>
                                    <li>Check out the <Link href="https://github.com/LeoFranklin015/warpads-agentic-hack/tree/main/avs" target="_blank" className="text-cyan-400">WarpAds AVS operator source code</Link> to learn more about running a validator node.</li>
                                    <li>Operators need to stake ETH in EigenLayer to participate in validation and earn rewards.</li>
                                    <li>The AVS uses ECDSA signatures for validating ad engagement metrics and distributing incentives.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="mt-12 space-y-8">
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Web3 x AI Intersection</h3>
                                <p className="text-slate-300">
                                    WarpAds is positioned to become the defacto ad protocol for AI agents, enabling a paradigm shift in user experiences (agentic UX). By leveraging scalable and fast blockchain networks like Arbitrum, Mode, and Sei, WarpAds ensures a transparent, decentralized, and ethically driven ad ecosystem.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800/50 ring-1 ring-white/10">
                                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Contract Addresses</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Base Sepolia</h4>
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0x14F729862e63c4B4b9a1c6115Db90B6022de80B9</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0x3817f9e86E537BCf61e36663BA725e5D573d50bF</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0x8d6Cb187e6933b06807d5Db58e93c7A3fcB725c0</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0xE13286840a109A412e67077eE70191740AAA4d18</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Arbitrum Sepolia</h4>
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0xAA0122575750fc7437D0de827329637A322bfee1</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0x9fd03E8B51c7559d4B3Cc633609dB264FBE16825</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0xe779738E801Bfd80B33Ce41c0c2b651EBe6A7109</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Flow Testnet</h4>
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0x4Bac3740e3980731f041983B61C075a2D316e78A</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0x4Cbb5045BC463ac91D2dDD24AF4639F1D98f32Ef</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0xce0f39abbF9e8d42F9c64fF5EC7bfbb919bedE8E</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
