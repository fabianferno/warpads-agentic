import {
  AdSpaceRegistered as AdSpaceRegisteredEvent,
  CampaignRegistered as CampaignRegisteredEvent,
  CampaignTerminated as CampaignTerminatedEvent,
  EmergencyShutdown as EmergencyShutdownEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  StakeSlashed as StakeSlashedEvent,
  StakeWithdrawn as StakeWithdrawnEvent,
  Unpaused as UnpausedEvent,
  ValidatorUpdated as ValidatorUpdatedEvent,
} from "../generated/WarpadsProtocol/WarpadsProtocol";

import { AdSpace, AdCampaign, User } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleAdSpaceRegistered(event: AdSpaceRegisteredEvent): void {
  let adSpaceId = event.params.adSpaceId.toString();
  let adSpace = new AdSpace(adSpaceId);
  adSpace.owner = event.params.owner;
  adSpace.stakedWarp = event.params.stake;
  adSpace.metadataURI = event.params.metadataURI;
  adSpace.rewardsAccumulated = BigInt.fromI32(0);
  adSpace.isActive = true;
  adSpace.createdAt = event.block.timestamp;
  adSpace.transactionHash = event.transaction.hash;
  adSpace.save();

  // Update the User entity for the owner
  let userId = event.params.owner.toHex();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.adSpaces = [];
    user.adCampaigns = [];
    user.createdAt = event.block.timestamp;
  }
  let adSpaces = user.adSpaces;
  adSpaces.push(adSpace.id);
  user.adSpaces = adSpaces;
  user.updatedAt = event.block.timestamp;
  user.save();
}

export function handleCampaignRegistered(event: CampaignRegisteredEvent): void {
  let campaignId = event.params.campaignId.toString();
  let campaign = new AdCampaign(campaignId);
  campaign.owner = event.params.owner;
  campaign.expiry = event.params.expiry;
  campaign.priorityStake = event.params.priorityStake;
  campaign.adContent = event.params.adContent;
  campaign.isActive = true;
  campaign.createdAt = event.block.timestamp;
  campaign.transactionHash = event.transaction.hash;
  campaign.save();

  // Update the User entity for the owner
  let userId = event.params.owner.toHex();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.adSpaces = [];
    user.adCampaigns = [];
    user.createdAt = event.block.timestamp;
  }
  let campaigns = user.adCampaigns;
  campaigns.push(campaign.id);
  user.adCampaigns = campaigns;
  user.updatedAt = event.block.timestamp;
  user.save();
}

export function handleCampaignTerminated(event: CampaignTerminatedEvent): void {
  let campaignId = event.params.campaignId.toString();
  let campaign = AdCampaign.load(campaignId);
  if (campaign == null) {
    return;
  }
  campaign.isActive = false;
  campaign.updatedAt = event.block.timestamp;
  campaign.save();
}

export function handleEmergencyShutdown(event: EmergencyShutdownEvent): void {
  // TODO: Implement this
  log.info("Emergency shutdown triggered by {}", [
    event.params.triggeredBy.toHex(),
  ]);
}

export function handlePaused(event: PausedEvent): void {
  // TODO: Implement this
  log.info("Paused event triggered by {}", [event.params.account.toHex()]);
}

export function handleStakeSlashed(event: StakeSlashedEvent): void {
  let adSpaceId = event.params.adSpaceId.toString();
  let adSpace = AdSpace.load(adSpaceId);
  if (adSpace == null) {
    // If the ad space does not exist, exit early.
    return;
  }
  // Subtract the withdrawn amount from the stakedWarp
  adSpace.stakedWarp = adSpace.stakedWarp.minus(event.params.amount);
  adSpace.updatedAt = event.block.timestamp;
  adSpace.save();
}

export function handleStakeWithdrawn(event: StakeWithdrawnEvent): void {
  let adSpaceId = event.params.adSpaceId.toString();
  let adSpace = AdSpace.load(adSpaceId);
  if (adSpace == null) {
    // If the ad space does not exist, exit early.
    return;
  }
  // Subtract the withdrawn amount from the stakedWarp
  adSpace.stakedWarp = adSpace.stakedWarp.minus(event.params.amount);
  adSpace.updatedAt = event.block.timestamp;
  adSpace.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  // TODO: Implement this
  log.info("Unpaused event triggered by {}", [event.params.account.toHex()]);
}

export function handleValidatorUpdated(event: ValidatorUpdatedEvent): void {
  // TODO: Implement this
  log.info("Validator updated event triggered by {}", [
    event.params.oldValidator.toHex(),
    event.params.newValidator.toHex(),
  ]);
}
