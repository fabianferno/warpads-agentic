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
  ValidatorUpdated as ValidatorUpdatedEvent
} from "../generated/WarpadsProtocol/WarpadsProtocol"
import {
  AdSpaceRegistered,
  CampaignRegistered,
  CampaignTerminated,
  EmergencyShutdown,
  OwnershipTransferred,
  Paused,
  StakeSlashed,
  StakeWithdrawn,
  Unpaused,
  ValidatorUpdated
} from "../generated/schema"

export function handleAdSpaceRegistered(event: AdSpaceRegisteredEvent): void {
  let entity = new AdSpaceRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.adSpaceId = event.params.adSpaceId
  entity.owner = event.params.owner
  entity.stake = event.params.stake
  entity.metadataURI = event.params.metadataURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignRegistered(event: CampaignRegisteredEvent): void {
  let entity = new CampaignRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.owner = event.params.owner
  entity.expiry = event.params.expiry
  entity.priorityStake = event.params.priorityStake
  entity.adContent = event.params.adContent

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignTerminated(event: CampaignTerminatedEvent): void {
  let entity = new CampaignTerminated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEmergencyShutdown(event: EmergencyShutdownEvent): void {
  let entity = new EmergencyShutdown(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.triggeredBy = event.params.triggeredBy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakeSlashed(event: StakeSlashedEvent): void {
  let entity = new StakeSlashed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.adSpaceId = event.params.adSpaceId
  entity.amount = event.params.amount
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakeWithdrawn(event: StakeWithdrawnEvent): void {
  let entity = new StakeWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.adSpaceId = event.params.adSpaceId
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleValidatorUpdated(event: ValidatorUpdatedEvent): void {
  let entity = new ValidatorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldValidator = event.params.oldValidator
  entity.newValidator = event.params.newValidator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
