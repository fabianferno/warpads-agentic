![image](https://github.com/user-attachments/assets/86833bb7-2433-4ac0-a266-a0ef799ca982)

# WarpAds (Agentic Ad Network)

##### Project Name

WarpAds

##### Primary contact email

fabian@warpads.xyz

##### Project X handle

@warp_ads

##### Tracks that you're submitting for

- Autonome
- Base
- Flow
- Eigen Layer

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

##### Contract Address

Base

- warpTokenAddress: "0x14F729862e63c4B4b9a1c6115Db90B6022de80B9"
- adspaceAddress: "0x3817f9e86E537BCf61e36663BA725e5D573d50bF"
- adcampaignAddress: "0x8d6Cb187e6933b06807d5Db58e93c7A3fcB725c0"
- warpadsAddress: "0xE13286840a109A412e67077eE70191740AAA4d18"

Arbitrum

- warpTokenAddress: "0xAA0122575750fc7437D0de827329637A322bfee1"
- adspaceAddress: "0x9fd03E8B51c7559d4B3Cc633609dB264FBE16825"
- adcampaignAddress: "0xe779738E801Bfd80B33Ce41c0c2b651EBe6A7109"
- warpadsAddress: "0x9eD48b303ADddb3F5D40D2FD7E039b9FFbfAB0E3"

Flow

- warpTokenAddress: "0x4Bac3740e3980731f041983B61C075a2D316e78A"
- adspaceAddress: "0x4Cbb5045BC463ac91D2dDD24AF4639F1D98f32Ef"
- adcampaignAddress: "0xce0f39abbF9e8d42F9c64fF5EC7bfbb919bedE8E"
- warpadsAddress: "0x8A5fA1b0A754Ca969a748bF507b41c76aB43DC97"

##### Deployed on (if application)

Vercel.com - Front end
Render.com - Backend, Indexers, Agent

##### GitHub Repository

https://github.com/LeoFranklin015/warpads-agentic-hack

##### Live deployment / Access instructions

https://warpads.xyz/

##### Technical Documentation

https://warpads.xyz/docs
