// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AdSpaceNFT.sol";
import "./AdCampaignNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WarpAdsProtocol
 * @dev A decentralized advertising platform that manages ad spaces and campaigns using NFTs
 * @notice This contract handles the core business logic for the Warp Ads platform
 * @custom:security-contact security@warpads.com
 */
contract WarpAdsProtocol is ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;

    // Constants
    uint256 public constant MIN_STAKE = 0.5 ether; // 0.5 WARP minimum stake
    uint256 public constant MAX_CAMPAIGN_DURATION = 365 days;
    uint256 public constant MIN_CAMPAIGN_DURATION = 1 days;
    uint256 public constant MIN_PRIORITY_STAKE = 0.1 ether;
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 200; // 2% (basis points)
    uint256 public constant BASIS_POINTS = 10000; // For percentage calculations

    IERC20 public immutable warpToken;
    address public immutable treasury;
    address public validator;

    AdSpaceNFT public adSpace;
    CampaignNFT public campaign;

    // Store metadata for each AdSpace and Campaign
    mapping(uint256 => AdSpace) public adSpaces;
    mapping(uint256 => Campaign) public campaigns;

    struct AdSpace {
        address owner;
        uint256 stakedWarp;
        string metadataURI;
        uint256 rewardsAccumulated;
        bool isActive;
    }

    struct Campaign {
        address owner;
        uint256 expiry;
        uint256 priorityStake;
        string adContent;
        bool isActive;
    }

    // Events
    event AdSpaceRegistered(
        uint256 indexed adSpaceId,
        address indexed owner,
        uint256 stake
    );
    event CampaignRegistered(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 expiry
    );
    event StakeWithdrawn(
        uint256 indexed adSpaceId,
        address indexed owner,
        uint256 amount
    );
    event CampaignTerminated(uint256 indexed campaignId);
    event EmergencyShutdown(address indexed triggeredBy);
    event ValidatorUpdated(
        address indexed oldValidator,
        address indexed newValidator
    );
    event StakeSlashed(
        uint256 indexed adSpaceId,
        uint256 amount,
        string reason
    );

    /**
     * @dev Modifier to restrict access to validator
     */
    modifier onlyValidator() {
        require(msg.sender == validator, "Only validator can call");
        _;
    }

    /**
     * @dev Contract constructor
     * @param _treasury Address of the treasury contract
     * @param _warpToken Address of the WARP token contract
     * @param _adSpace Address of the AdSpace NFT contract
     * @param _campaign Address of the Campaign NFT contract
     * @param _validator Address of the initial validator
     */
    constructor(
        address _treasury,
        address _warpToken,
        address _adSpace,
        address _campaign,
        address _validator
    ) {
        require(_treasury != address(0), "Invalid treasury address");
        require(
            _warpToken != address(0),
            "Invalid WARP Token Contract address"
        );
        require(_adSpace != address(0), "Invalid AdSpace Contract address");
        require(_campaign != address(0), "Invalid Campaign Contract address");
        require(_validator != address(0), "Invalid validator address");

        treasury = _treasury;
        warpToken = IERC20(_warpToken);
        adSpace = AdSpaceNFT(_adSpace);
        campaign = CampaignNFT(_campaign);
        validator = _validator;
        emit ValidatorUpdated(address(0), _validator);
    }

    /**
     * @dev Set new validator (owner only)
     * @param newValidator Address of the new validator
     */
    function setValidator(address newValidator) external onlyOwner {
        require(newValidator != address(0), "Invalid validator address");
        address oldValidator = validator;
        validator = newValidator;
        emit ValidatorUpdated(oldValidator, newValidator);
    }

    /**
     * @dev Register a new ad space
     * @param metadataURI IPFS URI containing ad space metadata
     * @param warpStake Amount of WARP tokens to stake
     */
    function registerAgent(
        string memory metadataURI,
        uint256 warpStake
    ) external nonReentrant whenNotPaused {
        require(msg.sender != address(0), "Invalid address");
        require(bytes(metadataURI).length > 0, "Empty metadata URI");
        require(warpStake >= MIN_STAKE, "Insufficient stake");

        uint256 adSpaceId = adSpace.mintAdSpace(msg.sender, metadataURI);

        adSpaces[adSpaceId] = AdSpace({
            owner: msg.sender,
            stakedWarp: warpStake,
            metadataURI: metadataURI,
            rewardsAccumulated: 0,
            isActive: true
        });

        require(
            warpToken.transferFrom(msg.sender, address(this), warpStake),
            "Warp token transfer failed"
        );

        emit AdSpaceRegistered(adSpaceId, msg.sender, warpStake);
    }

    /**
     * @dev Register a new ad campaign
     * @param durationDays Duration of the campaign in days
     * @param priorityStake Additional stake for campaign priority
     * @param adContent IPFS URI containing ad content
     */
    function registerCampaign(
        uint256 durationDays,
        uint256 priorityStake,
        string memory adContent
    ) external nonReentrant whenNotPaused {
        require(
            durationDays * 1 days >= MIN_CAMPAIGN_DURATION,
            "Duration too short"
        );
        require(
            durationDays * 1 days <= MAX_CAMPAIGN_DURATION,
            "Duration too long"
        );
        require(priorityStake >= MIN_PRIORITY_STAKE, "Priority stake too low");
        require(bytes(adContent).length > 0, "Empty ad content");

        uint256 campaignCost = priorityStake;
        uint256 platformFee = (priorityStake * PLATFORM_FEE_PERCENTAGE) /
            BASIS_POINTS;
        uint256 totalCost = campaignCost + platformFee;

        require(
            warpToken.transferFrom(msg.sender, address(this), totalCost),
            "Warp token transfer failed"
        );

        // Send platform fee to treasury
        require(
            warpToken.transfer(treasury, platformFee),
            "Fee transfer failed"
        );

        // Distribute campaign cost to ad space owners
        uint256 totalAdSpaces = adSpace.totalSupply();
        require(totalAdSpaces > 0, "No ad spaces available");
        uint256 rewardPerSpace = campaignCost / totalAdSpaces;

        for (uint256 i = 0; i < totalAdSpaces; i++) {
            AdSpace storage space = adSpaces[i];
            if (space.isActive) {
                space.rewardsAccumulated += rewardPerSpace;
            }
        }

        uint256 campaignId = campaign.mintCampaign(msg.sender, adContent);
        uint256 expiry = block.timestamp + (durationDays * 1 days);

        campaigns[campaignId] = Campaign({
            owner: msg.sender,
            expiry: expiry,
            priorityStake: priorityStake,
            adContent: adContent,
            isActive: true
        });

        emit CampaignRegistered(campaignId, msg.sender, expiry);
    }

    /**
     * @dev Check if a campaign is expired
     * @param campaignId ID of the campaign to check
     * @return bool indicating if the campaign is expired
     */
    function isCampaignExpired(uint256 campaignId) public view returns (bool) {
        Campaign storage camp = campaigns[campaignId];
        return block.timestamp >= camp.expiry || !camp.isActive;
    }

    /**
     * @dev Withdraw staked WARP tokens from an ad space
     * @param adSpaceId ID of the ad space
     * @param amount Amount of WARP to withdraw
     */
    function withdrawStake(
        uint256 adSpaceId,
        uint256 amount
    ) external nonReentrant {
        AdSpace storage space = adSpaces[adSpaceId];
        require(msg.sender == space.owner, "Not owner");
        require(space.stakedWarp >= amount, "Insufficient stake");
        require(
            space.stakedWarp - amount >= MIN_STAKE,
            "Must maintain minimum stake"
        );

        space.stakedWarp -= amount;
        require(warpToken.transfer(msg.sender, amount), "Transfer failed");

        emit StakeWithdrawn(adSpaceId, msg.sender, amount);
    }

    /**
     * @dev Terminate a campaign early (validator only)
     * @param campaignId ID of the campaign to terminate
     */
    function terminateCampaign(uint256 campaignId) external onlyValidator {
        Campaign storage camp = campaigns[campaignId];
        require(camp.isActive, "Campaign not active");

        camp.isActive = false;
        emit CampaignTerminated(campaignId);
    }

    /**
     * @dev Slash stake from an ad space (validator only)
     * @param adSpaceId ID of the ad space
     * @param amount Amount to slash
     * @param reason Reason for slashing
     */
    function slashStake(
        uint256 adSpaceId,
        uint256 amount,
        string memory reason
    ) external onlyValidator {
        require(adSpaces[adSpaceId].stakedWarp >= amount, "Insufficient stake");
        adSpaces[adSpaceId].stakedWarp -= amount;
        require(
            warpToken.transfer(validator, amount),
            "Warp token transfer failed"
        );
        emit StakeSlashed(adSpaceId, amount, reason);
    }

    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = warpToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        require(
            warpToken.transfer(owner(), balance),
            "Warp token transfer failed"
        );
    }

    /**
     * @dev Pause the contract in case of emergency (owner only)
     */
    function pause() external onlyOwner {
        _pause();
        emit EmergencyShutdown(msg.sender);
    }

    /**
     * @dev Unpause the contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Claim accumulated rewards from an ad space
     * @param adSpaceId ID of the ad space to claim rewards from
     */
    function claimRewards(uint256 adSpaceId) external nonReentrant {
        AdSpace storage space = adSpaces[adSpaceId];
        require(msg.sender == space.owner, "Not owner");
        require(space.rewardsAccumulated > 0, "No rewards to claim");

        uint256 amount = space.rewardsAccumulated;
        space.rewardsAccumulated = 0;

        require(warpToken.transfer(msg.sender, amount), "Transfer failed");
    }
}
