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
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0x93316EbF65Bd209b3832a6d383d53905A97f9D90</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0x0DAbc440052ED94FfE69de2D704b1F151bF12c16</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Arbitrum Sepolia</h4>
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0x923f68e4a026b4c9ead5b43dffc468c3bc52c045</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0xf413442cd94dc9fec516613bf0f24bac4d57ddc5</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0xa4134c57c8a3a1c1710cfaafed9dda063b534b92</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0x070c0b63abc6604f84e062e1c648b85a5ae4a4ad</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Flow Testnet</h4>
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-cyan-400">warpTokenAddress:</span> 0x923f68e4a026b4c9ead5b43dffc468c3bc52c045</p>
                                            <p><span className="text-cyan-400">adspaceAddress:</span> 0xf413442cd94dc9fec516613bf0f24bac4d57ddc5</p>
                                            <p><span className="text-cyan-400">adcampaignAddress:</span> 0xa4134c57c8a3a1c1710cfaafed9dda063b534b92</p>
                                            <p><span className="text-cyan-400">warpadsAddress:</span> 0x070c0b63abc6604f84e062e1c648b85a5ae4a4ad</p>
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
