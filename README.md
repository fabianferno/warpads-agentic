![image](https://github.com/user-attachments/assets/86833bb7-2433-4ac0-a266-a0ef799ca982)

# WarpAds CookieDAO Application

##### Project Name

WarpAds

##### Primary contact email

fabian@warpads.xyz

##### Project X handle

@warp_ads

##### Tracks that you're submitting for

- Cookie.fun track
- Dedicated chain tracks
  - Arbitrum Track
  - Mode Track
  - SEI Track

##### Description

WarpAds: The first decentralized ad network built for AI agents.

- For Developers: Monetize agents instantly with 3 lines of code. Seamless integration with top frameworks (Eliza, CrewAI, LangGraph)—no UX compromises, just passive revenue.
- For Advertisers: Unlock 1,500+ AI "influencers" (10k+ daily users) with hyper-targeted, conversational ads. Reach niche audiences—coding assistants, travel planners, shopping agents—using AI-native intent signals for unmatched relevance. | source: cookie.fun
- For Users: Ads that add value, not clutter. Contextual recommendations blend naturally into agent interactions.

Advertisers gain real-time analytics and dynamic bidding; developers earn effortlessly; users keep trust. Transform AI ecosystems into ethical ad channels—today.

Key Functionalities:

- Agents: Agent devs can get started with the simple steps:
  1.  Register as agent adspace on the protocol. This mints an ERC721 token for the agent. Copy the generated API key
  2.  Install the WarpAds plugin and configure the `WARPAD_API_KEY` in the env
  3.  Stake some WARP tokens - this will be slashed when the ad validation fails and the agent tries to attempt a replay attack. Agent without stake will not be eligible for incentives
- Ad campaigns: Advertisers can create campaign like this:
  1.  Create a new campaign: Each campaign is an ERC721 NFT which can be traded on any secondary marketplaces to utilize/update ad metadata. Ads are embedded and store on a vector store.
  2.  Campaign costs are calculated based on a fixed platform fee multiplied by the campaign duration, with additional priority fees for higher visibility.
  3.  The WarpAds Ad engine embeds ads contextually and tracks engagement for incentive distribution.
- Validators/Operators
  1.  Operators help with validating and incentive calculations by using LLM computer use APIs to check with the tweets and the agent's influence.
  2.  Additionally we're working on wrapping this service over an Actively Validation Service with the Eigen Layer.

##### How does your project utilize Cookie DataSwarm API

WarpAds uses the Cookie DataSwarm API to robustly calculate a “fame multiplier” based on average impressions and engagement counts. This multiplier helps determine reward distributions for ad context providers—mirroring how more influential figures earn higher revenues.

##### How is your project on the Web3 x AI intersection?

WarpAds is positioned to become the defacto ad protocol for AI agents, enabling a paradigm shift in user experiences (agentic UX). By leveraging scalable and fast blockchain networks like Arbitrum, Mode, and Sei, WarpAds ensures a transparent, decentralized, and ethically driven ad ecosystem.

##### Contract Address (if Applicable)

Sei Devnet

- warpTokenAddress: "0x93316EbF65Bd209b3832a6d383d53905A97f9D90"
- adspaceAddress: "0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB"
- adcampaignAddress: "0x0DAbc440052ED94FfE69de2D704b1F151bF12c16"
- warpadsAddress: "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78",

Arbitrum Sepolia

- warpTokenAddress: "0xFCED24D3CD405DCdC62265846F51328a67142Af3"
- adspaceAddress: "0x8B386Edef0750FFFA8d15e514992E919e21dc828"
- adcampaignAddress: "0xb830f7702a262AbDcaDA58fc760a9D313587aF30"
- warpadsAddress: "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3"

Mode Testnet

- warpTokenAddress: "0x93316EbF65Bd209b3832a6d383d53905A97f9D90"
- adspaceAddress: "0x57223AABb448F552Bd69cd48e4bCA980aDa9EAaB"
- adcampaignAddress: "0x0DAbc440052ED94FfE69de2D704b1F151bF12c16"
- warpadsAddress: "0xDb487D11Ea86Fa1722313721AD4423dcfEfcFD78",

##### Deployed on (if application)

Vercel.com - Front end
Render.com - Backend, Indexers, Agent

##### GitHub Repository

https://github.com/fabianferno/warpads-cookie-hack

##### Live deployment / Access instructions

https://warpads-cookies.vercel.app/

##### Technical Documentation

https://warpads-cookies.vercel.app/docs

##### Do you plan on developing this project after the hackathon

Yes, we have plans to apply for grants and continue working on this project and try to get more agents to use the platform.

##### Anything else we should know

We are also going to be submitting the project at EthGlobal Agentic Hackathon since both the timelines coincide and all the source code was developed within the timelines and are following the guidelines of the hackathon. We believe this will not be a problem but if it going to be a problem, please let us know so that we won't apply with this project anywhere else.
