// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Import the PositionNFT contract
import "./PositionNFT.sol";
import "../Factory/GMXFactory.sol";
import "../Adapters/GMXAdapter.sol";

contract NFTHandler {
    PositionNFT public positionNFTContract;
    GMXFactory public gmxFactoryContract;
    GMXAdapter public gmxAdapterContract;

    // Mapping to store whether an NFT with a specific set of position IDs has been minted or not.
    mapping(bytes32 => bool) private mintedNFTs;

    // Mapping to store PositionIds against TokenId
    mapping(uint256 => bytes32[]) private tokenIds;

    // Events
    event NftMinted(bytes32[] positionID, address owner, uint256 tokenId);
    event NftBurned(uint256 tokenId);

    /**
     * @dev Constructor to set the PositionNFT contract address.
     *
     * @param _positionNFTAddress The address of the PositionNFT contract.
     * @param _gmxFactoryContract The address of the PositionNFT contract.
     */
    constructor(address _positionNFTAddress, address _gmxFactoryContract) {
        positionNFTContract = PositionNFT(_positionNFTAddress);
        gmxFactoryContract = GMXFactory(_gmxFactoryContract);
    }

    /**
     * @dev Mint an NFT and associate it with the given position IDs.
     *
     * @param positionIDs An array of position IDs to be associated with the NFT.
     * @param to The address to which the NFT will be minted and transferred.
     * @return The token ID of the newly minted NFT.
     */
    function mintNFT(bytes32[] calldata positionIDs, address to) external returns (uint256) {
        // Check if all position IDs exist in the GMXFactory contract
        for (uint256 i = 0; i < positionIDs.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(positionIDs[i]);
            require(data[0] != 0, "Position does not exist in GMX");
            require(gmxFactoryContract.getPositionOwner(positionIDs[i]) == msg.sender, "Not a position owner");
        }

        // Generate a unique identifier for the set of position IDs
        bytes32 combinedPositionIDs = keccak256(abi.encodePacked(positionIDs));

        // Check if the NFT with the same set of position IDs has already been minted
        require(!mintedNFTs[combinedPositionIDs], "NFT already minted for these position IDs");

        // Mint the NFT using the PositionNFT contract
        uint256 tokenId = positionNFTContract.mint(to, positionIDs);

        // Mark the NFT as minted for the specific set of position IDs
        mintedNFTs[combinedPositionIDs] = true;

        // Emit an event to indicate that the NFT has been minted and associated with the position IDs
        emit NftMinted(positionIDs, to, tokenId);

        return tokenId;
    }

    /**
     * @dev Burn the NFT with the given token ID if all the associated positions are closed.
     *
     * @param tokenId The token ID of the NFT to be burned.
     */
    function burnNFT(uint256 tokenId) external {
        // Check if the token exists and belongs to the sender
        require(positionNFTContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");

        // Get the associated position IDs for the given token ID
        bytes32[] memory positionIds = positionNFTContract.getPositonIds(tokenId);

        // Check if all the associated positions are closed
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(positionIds[i]);
            require(data[0] == 0, "Not all positions are closed");
        }

        // Burn the NFT using the PositionNFT contract
        positionNFTContract.burn(tokenId);

        // Emit an event to indicate that the NFT has been burned
        emit NftBurned(tokenId);
    }

       /**
     * @dev Transfers an NFT and associate it with the given position IDs.
     *
     * @param tokenId The token ID of the NFT to be transfered.
     * @param to The address to which the NFT will be transferred.
     */
    function transferNft(uint256 tokenId, address to) external {
        // Check if the token exists and belongs to the sender
        require(positionNFTContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");

        // Get the associated position IDs for the given token ID
        bytes32[] memory positionIds = positionNFTContract.getPositonIds(tokenId);

        // Check if all position IDs exist in the GMXFactory contract
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(positionIds[i]);
            require(data[0] != 0, "Position does not exist in GMX");
            require(gmxFactoryContract.getPositionOwner(positionIds[i]) == msg.sender, "Not a position owner");
        }

        // Transfer the NFT using the PositionNFT contract
        bool success = positionNFTContract.safeTransferFrom(msg.sender, to, tokenId);
        if (success) {
            for (uint256 i = 0; i < positionIds.length; i++) {
                address gmxAdapter = gmxFactoryContract.getPositionAdapter(positionIds[i]);
                require(changeOwnerOfAdapter(gmxAdapter, to) == true);
            }
        }
    }

    /**
     * @dev Change Ownership of Adapter contract.
     *
     * @param _gmxAdapter The address of the adapter contract.
     * @param _newOwner The address of the new owner of that position.
     */
    function changeOwnerOfAdapter(address _gmxAdapter, address _newOwner) internal returns (bool) {
        gmxAdapterContract = GMXAdapter(_gmxAdapter);
        require(gmxAdapterContract.changePositonOwner(_newOwner));
        return true;
    }

}
