// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CampaignNFT
 * @dev NFT contract for representing advertising campaigns in the WarpAds protocol
 * @notice This contract manages the creation and tracking of ad campaign NFTs
 * @custom:security-contact security@warpads.com
 */
contract CampaignNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    Pausable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Events
    event CampaignMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string adContent
    );
    event CampaignBurned(uint256 indexed tokenId);
    event CampaignContentUpdated(uint256 indexed tokenId, string newContent);
    event BaseURIChanged(string newBaseURI);

    // Mapping to track if a campaign's content can be updated
    mapping(uint256 => bool) public isContentMutable;

    // Mapping to store campaign expiry timestamps
    mapping(uint256 => uint256) public campaignExpiry;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    /**
     * @dev Mint a new campaign NFT (only owner)
     * @param to Address to mint the NFT to
     * @param adContent IPFS URI containing campaign content
     * @return uint256 ID of the minted NFT
     */
    function mintCampaign(
        address to,
        string memory adContent
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(bytes(adContent).length > 0, "Empty ad content");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, adContent);
        isContentMutable[newTokenId] = true;

        emit CampaignMinted(newTokenId, to, adContent);
        return newTokenId;
    }

    /**
     * @dev Update campaign content (if allowed)
     * @param tokenId ID of the campaign to update
     * @param newContent New IPFS URI containing updated content
     */
    function updateCampaignContent(
        uint256 tokenId,
        string memory newContent
    ) external {
        require(_exists(tokenId), "Campaign does not exist");
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Not approved or owner"
        );
        require(isContentMutable[tokenId], "Content not mutable");
        require(bytes(newContent).length > 0, "Empty content");

        _setTokenURI(tokenId, newContent);
        emit CampaignContentUpdated(tokenId, newContent);
    }

    /**
     * @dev Set campaign expiry timestamp
     * @param tokenId ID of the campaign
     * @param expiryTimestamp Unix timestamp when campaign expires
     */
    function setCampaignExpiry(
        uint256 tokenId,
        uint256 expiryTimestamp
    ) external onlyOwner {
        require(_exists(tokenId), "Campaign does not exist");
        require(expiryTimestamp > block.timestamp, "Invalid expiry time");
        campaignExpiry[tokenId] = expiryTimestamp;
    }

    /**
     * @dev Check if a campaign is expired
     * @param tokenId ID of the campaign to check
     * @return bool indicating if the campaign is expired
     */
    function isCampaignExpired(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Campaign does not exist");
        return block.timestamp >= campaignExpiry[tokenId];
    }

    /**
     * @dev Burn a campaign NFT
     * @param tokenId ID of the token to burn
     */
    function burn(uint256 tokenId) external {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Not approved or owner"
        );
        _burn(tokenId);
        emit CampaignBurned(tokenId);
    }

    /**
     * @dev Set whether campaign content can be updated
     * @param tokenId ID of the campaign
     * @param _mutable Whether the content can be updated
     */
    function setContentMutable(
        uint256 tokenId,
        bool _mutable
    ) external onlyOwner {
        require(_exists(tokenId), "Campaign does not exist");
        isContentMutable[tokenId] = _mutable;
    }

    /**
     * @dev Override transfer function to check campaign status
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        if (from != address(0)) {
            // Skip check during minting
            require(
                !isCampaignExpired(tokenId) || to == address(0),
                "Campaign expired"
            );
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Pause token transfers (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Required overrides
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
