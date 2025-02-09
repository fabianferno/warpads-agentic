import { flowPublicClient } from "../config/publicClient";
import { AdCampaignCreated } from "../utilities/EventHandlers/AdCampaignCreated";
import { AdSpaceRegister } from "../utilities/EventHandlers/AdSpaceRegister";
import { RewardClaimed } from "../utilities/EventHandlers/RewardClaimed";

export class FlowContractListener {
  private unwatch: (() => void) | null = null;

  constructor(private readonly contractAddress: string) {}

  public async startListening(): Promise<void> {
    // Listen for AdSpaceRegistered events
    const adSpaceUnwatch = flowPublicClient.watchEvent({
      address: this.contractAddress as `0x${string}`,
      event: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "adSpaceId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "stake",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "metadataURI",
            type: "string",
          },
        ],
        name: "AdSpaceRegistered",
        type: "event",
      },
      onLogs: (logs) => {
        console.log("AdSpaceRegistered event detected:");
        logs.forEach(async (log) => {
          console.log({
            adSpaceId: log.args.adSpaceId,
            owner: log.args.owner,
            stake: log.args.stake,
            metadataURI: log.args.metadataURI,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          });
          await AdSpaceRegister(
            Number(log.args.adSpaceId),
            log.args.owner as `0x${string}`,
            log.args.metadataURI as string,
            Number(log.args.stake),
            545
          );
        });
      },
    });

    // Listen for AdCampaignRegistered events
    const adCampaignUnwatch = flowPublicClient.watchEvent({
      address: this.contractAddress as `0x${string}`,
      event: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "campaignId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "expiry",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "priorityStake",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "adContent",
            type: "string",
          },
        ],
        name: "CampaignRegistered",
        type: "event",
      },
      onLogs: (logs) => {
        console.log("AdCampaignRegistered event detected:");
        logs.forEach(async (log) => {
          console.log({
            campaignId: log.args.campaignId,
            owner: log.args.owner,
            expiry: log.args.expiry,
            priorityStake: log.args.priorityStake,
            adContent: log.args.adContent,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          });
          await AdCampaignCreated(
            Number(log.args.campaignId),
            log.args.owner as `0x${string}`,
            log.args.adContent as string,
            Number(log.args.priorityStake),
            Number(log.args.expiry),
            545
          );
        });
      },
    });

    // Listen for RewardsClaimed events
    const rewardsClaimedUnwatch = flowPublicClient.watchEvent({
      address: this.contractAddress as `0x${string}`,
      event: {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "adSpaceId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "RewardsClaimed",
        type: "event",
      },
      onLogs: (logs) => {
        console.log("RewardsClaimed event detected:");
        logs.forEach(async (log) => {
          console.log({
            adSpaceId: log.args.adSpaceId,
            owner: log.args.owner,
            amount: log.args.amount,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          });
          await RewardClaimed(
            Number(log.args.adSpaceId),
            545,
            log.args.owner as `0x${string}`,
            Number(log.args.amount)
          );
        });
      },
    });

    // Combine all unwatch functions
    this.unwatch = () => {
      adSpaceUnwatch();
      adCampaignUnwatch();
      rewardsClaimedUnwatch();
    };
  }

  public stopListening(): void {
    if (this.unwatch) {
      this.unwatch();
      this.unwatch = null;
    }
  }
}
