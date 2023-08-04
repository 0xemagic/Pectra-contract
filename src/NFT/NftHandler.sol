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

    // Mapping to store PositionIds against TokenId
    mapping(uint256 => bytes32[]) private _tokenIds;

    // Mapping to store which PositionId has been used for minting the NFT
    mapping (bytes32 => bool) private _mintedPositionIds;

    // Mapping that stores all the PositonIds against a TokenId individually
    mapping (bytes32 => uint256) private _mappedTokenId;

    // Events
    event NftMinted(bytes32[] indexed positionID, address indexed owner, uint256 indexed tokenId);
    event NftBurned(uint256 indexed tokenId);
    event NftTransferred(uint256 indexed tokenId, address indexed newOwner);

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
            require(data[0] != 0, "NFT HANDLER: The position does not exist or already closed");
            require(gmxFactoryContract.getPositionOwner(positionIDs[i]) == msg.sender, "NFT HANDLER: Not a position owner");
            require(!_mintedPositionIds[positionIDs[i]], "NFT HANDLER: Position Id already minted");
        }

        uint256 tokenId;    
        // Mint the NFT using the PositionNFT contract
        require(tokenId = positionNFTContract.mint(to, positionIDs), "NFT HANDLER: Error while minting the NFT");

        for (uint256 i = 0; i < positionIDs.length; i++){
            _mintedPositionIds[positionIDs[i]] = true;
            _mappedTokenId[positionIDs[i]] = tokenId;

        }
        
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
        // Get the associated position IDs for the given token ID
        bytes32[] memory positionIds = _tokenIds[tokenId];

        // Check if all the associated positions are closed
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(positionIds[i]);
            require(data[0] == 0, "NFT HANDLER: Not all positions are closed");
        }

        // Burn the NFT using the PositionNFT contract
        require(positionNFTContract.burn(tokenId));

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
        require(positionNFTContract.ownerOf(tokenId) == msg.sender, "NFT HANDLER: Not the NFT owner");

        // Get the associated position IDs for the given token ID
        bytes32[] memory positionIds = _tokenIds[tokenId];

        // Check if all position IDs exist in the GMXFactory contract
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(positionIds[i]);
            require(data[0] != 0, "NFT HANDLER: Position does not or already closed");
            require(gmxFactoryContract.getPositionOwner(positionIds[i]) == msg.sender, "NFT HANDLER: Not a position owner");
        }

        // Transfer the NFT using the PositionNFT contract
        bool success = positionNFTContract.safeTransferFrom(msg.sender, to, tokenId);
        if (success) {
            for (uint256 i = 0; i < positionIds.length; i++) {
                address gmxAdapter = gmxFactoryContract.getPositionAdapter(positionIds[i]);
                require(_changeOwnerOfAdapter(gmxAdapter, to) == true, "NFT HANDLER: Error while changing the position owner from adapter");
                emit NftTransferred(tokenId, to);
            }
        }
    }

    /**
     * @dev Change Ownership of Adapter contract.
     *
     * @param _gmxAdapter The address of the adapter contract.
     * @param _newOwner The address of the new owner of that position.
     */
    function _changeOwnerOfAdapter(address _gmxAdapter, address _newOwner) internal returns (bool) {
        gmxAdapterContract = GMXAdapter(_gmxAdapter);
        require(gmxAdapterContract.changePositonOwner(_newOwner));
        return true;
    }

}
