import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AdSpaceRegistered } from "../generated/schema"
import { AdSpaceRegistered as AdSpaceRegisteredEvent } from "../generated/WarpadsProtocol/WarpadsProtocol"
import { handleAdSpaceRegistered } from "../src/warpads-protocol"
import { createAdSpaceRegisteredEvent } from "./warpads-protocol-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let adSpaceId = BigInt.fromI32(234)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let stake = BigInt.fromI32(234)
    let metadataURI = "Example string value"
    let newAdSpaceRegisteredEvent = createAdSpaceRegisteredEvent(
      adSpaceId,
      owner,
      stake,
      metadataURI
    )
    handleAdSpaceRegistered(newAdSpaceRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AdSpaceRegistered created and stored", () => {
    assert.entityCount("AdSpaceRegistered", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdSpaceRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "adSpaceId",
      "234"
    )
    assert.fieldEquals(
      "AdSpaceRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AdSpaceRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "stake",
      "234"
    )
    assert.fieldEquals(
      "AdSpaceRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
