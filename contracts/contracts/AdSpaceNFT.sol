// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AdSpaceNFT
 * @dev NFT contract for representing advertising spaces in the WarpAds protocol
 * @notice This contract manages the creation and tracking of ad space NFTs
 * @custom:security-contact security@warpads.com
 */
contract AdSpaceNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    Pausable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Events
    event AdSpaceMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI
    );
    event AdSpaceBurned(uint256 indexed tokenId);
    event BaseURIChanged(string newBaseURI);

    // Mapping to track if a token can be transferred
    mapping(uint256 => bool) public isTransferrable;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    /**
     * @dev Mint a new ad space NFT (only owner)
     * @param to Address to mint the NFT to
     * @param metadataURI IPFS URI containing ad space metadata
     * @return uint256 ID of the minted NFT
     */
    function mintAdSpace(
        address to,
        string memory metadataURI
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(bytes(metadataURI).length > 0, "Empty metadata URI");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        isTransferrable[newTokenId] = true;

        emit AdSpaceMinted(newTokenId, to, metadataURI);
        return newTokenId;
    }

    /**
     * @dev Burn an ad space NFT
     * @param tokenId ID of the token to burn
     */
    function burn(uint256 tokenId) external {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "Not approved or owner"
        );
        _burn(tokenId);
        emit AdSpaceBurned(tokenId);
    }

    /**
     * @dev Set whether a token can be transferred
     * @param tokenId ID of the token
     * @param transferrable Whether the token can be transferred
     */
    function setTransferrable(
        uint256 tokenId,
        bool transferrable
    ) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        isTransferrable[tokenId] = transferrable;
    }

    /**
     * @dev Override transfer function to check if token can be transferred
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        require(
            from == address(0) || // Allow minting
                to == address(0) || // Allow burning
                isTransferrable[tokenId], // Check if transferrable
            "Token transfer not allowed"
        );
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
