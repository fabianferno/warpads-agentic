import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/WarpadsProtocol/WarpadsProtocol"

export function createAdSpaceRegisteredEvent(
  adSpaceId: BigInt,
  owner: Address,
  stake: BigInt,
  metadataURI: string
): AdSpaceRegistered {
  let adSpaceRegisteredEvent = changetype<AdSpaceRegistered>(newMockEvent())

  adSpaceRegisteredEvent.parameters = new Array()

  adSpaceRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "adSpaceId",
      ethereum.Value.fromUnsignedBigInt(adSpaceId)
    )
  )
  adSpaceRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  adSpaceRegisteredEvent.parameters.push(
    new ethereum.EventParam("stake", ethereum.Value.fromUnsignedBigInt(stake))
  )
  adSpaceRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return adSpaceRegisteredEvent
}

export function createCampaignRegisteredEvent(
  campaignId: BigInt,
  owner: Address,
  expiry: BigInt,
  priorityStake: BigInt,
  adContent: string
): CampaignRegistered {
  let campaignRegisteredEvent = changetype<CampaignRegistered>(newMockEvent())

  campaignRegisteredEvent.parameters = new Array()

  campaignRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )
  campaignRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  campaignRegisteredEvent.parameters.push(
    new ethereum.EventParam("expiry", ethereum.Value.fromUnsignedBigInt(expiry))
  )
  campaignRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "priorityStake",
      ethereum.Value.fromUnsignedBigInt(priorityStake)
    )
  )
  campaignRegisteredEvent.parameters.push(
    new ethereum.EventParam("adContent", ethereum.Value.fromString(adContent))
  )

  return campaignRegisteredEvent
}

export function createCampaignTerminatedEvent(
  campaignId: BigInt
): CampaignTerminated {
  let campaignTerminatedEvent = changetype<CampaignTerminated>(newMockEvent())

  campaignTerminatedEvent.parameters = new Array()

  campaignTerminatedEvent.parameters.push(
    new ethereum.EventParam(
      "campaignId",
      ethereum.Value.fromUnsignedBigInt(campaignId)
    )
  )

  return campaignTerminatedEvent
}

export function createEmergencyShutdownEvent(
  triggeredBy: Address
): EmergencyShutdown {
  let emergencyShutdownEvent = changetype<EmergencyShutdown>(newMockEvent())

  emergencyShutdownEvent.parameters = new Array()

  emergencyShutdownEvent.parameters.push(
    new ethereum.EventParam(
      "triggeredBy",
      ethereum.Value.fromAddress(triggeredBy)
    )
  )

  return emergencyShutdownEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createStakeSlashedEvent(
  adSpaceId: BigInt,
  amount: BigInt,
  reason: string
): StakeSlashed {
  let stakeSlashedEvent = changetype<StakeSlashed>(newMockEvent())

  stakeSlashedEvent.parameters = new Array()

  stakeSlashedEvent.parameters.push(
    new ethereum.EventParam(
      "adSpaceId",
      ethereum.Value.fromUnsignedBigInt(adSpaceId)
    )
  )
  stakeSlashedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakeSlashedEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return stakeSlashedEvent
}

export function createStakeWithdrawnEvent(
  adSpaceId: BigInt,
  owner: Address,
  amount: BigInt
): StakeWithdrawn {
  let stakeWithdrawnEvent = changetype<StakeWithdrawn>(newMockEvent())

  stakeWithdrawnEvent.parameters = new Array()

  stakeWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "adSpaceId",
      ethereum.Value.fromUnsignedBigInt(adSpaceId)
    )
  )
  stakeWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  stakeWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return stakeWithdrawnEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createValidatorUpdatedEvent(
  oldValidator: Address,
  newValidator: Address
): ValidatorUpdated {
  let validatorUpdatedEvent = changetype<ValidatorUpdated>(newMockEvent())

  validatorUpdatedEvent.parameters = new Array()

  validatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldValidator",
      ethereum.Value.fromAddress(oldValidator)
    )
  )
  validatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newValidator",
      ethereum.Value.fromAddress(newValidator)
    )
  )

  return validatorUpdatedEvent
}
