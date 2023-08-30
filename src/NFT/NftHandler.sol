// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Import the PositionNFT contract
import "./IPositionNFT.sol";
import "../GMX/interfaces/IGMXFactory.sol";
import "../GMX/interfaces/IGMXAdapter.sol";

contract NFTHandler {
    IPositionNFT public positionNFTContract;
    IGMXFactory public gmxFactoryContract;
    IGMXAdapter public gmxAdapterContract;
    address public owner;

    // Mapping to store PositionIds against TokenId
    mapping(uint256 => bytes32[]) public _tokenIds;

    // Mapping to store which PositionId has been used for minting the NFT
    mapping(bytes32 => bool) public _mintedPositionIds;

    // Mapping that stores all the PositonIds against a TokenId individually
    mapping(bytes32 => uint256) public _mappedTokenId;

    // Events
    event NftMinted(
        bytes32[] indexed positionID,
        address indexed owner,
        uint256 indexed tokenId
    );
    event NftBurned(uint256 indexed tokenId);
    event NftTransferred(uint256 indexed tokenId, address indexed newOwner);

    // Modifier to restrict access to only the factory (owner) that mints NFTs.
    modifier onlyOwner() {
        require(owner == msg.sender, "PositionNFT: NOT_OWNER");
        _;
    }

    /**
     * @dev Constructor to set the PositionNFT contract address.
     *
     * @param _gmxFactoryContract The address of the PositionNFT contract.
     */
    constructor(address _gmxFactoryContract) {
        gmxFactoryContract = IGMXFactory(_gmxFactoryContract);
        owner = msg.sender;
    }

    /**
     * @dev Function to set the PositionNFT contract address.
     *
     * @param _positionNFTAddress The address of the PositionNFT contract.
     */
    function setPositionNft(address _positionNFTAddress) public onlyOwner {
        positionNFTContract = IPositionNFT(_positionNFTAddress);
    }

    /**
     * @dev Mint an NFT and associate it with the given position IDs.
     *
     * @param positionIDs An array of position IDs to be associated with the NFT.
     * @param to The address to which the NFT will be minted and transferred.
     * @return The token ID of the newly minted NFT.
     */
    function mintNFT(
        bytes32[] calldata positionIDs,
        address to
    ) external returns (uint256) {
        // Check if all position IDs exist in the GMXFactory contract
        for (uint256 i = 0; i < positionIDs.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(
                positionIDs[i]
            );
            require(
                data[0] != 0,
                "NFT HANDLER: The position does not exist or already closed"
            );
            require(
                gmxFactoryContract.getPositionOwner(positionIDs[i]) ==
                    msg.sender,
                "NFT HANDLER: Not a position owner"
            );
            require(
                !_mintedPositionIds[positionIDs[i]],
                "NFT HANDLER: Position Id already minted"
            );
        }

        uint256 tokenId;
        // Mint the NFT using the PositionNFT contract
        tokenId = positionNFTContract.mint(to, positionIDs);

        for (uint256 i = 0; i < positionIDs.length; i++) {
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
            uint256[] memory data = gmxFactoryContract.getPosition(
                positionIds[i]
            );
            require(data[0] == 0, "NFT HANDLER: Not all positions are closed");
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
        require(
            positionNFTContract.ownerOf(tokenId) == msg.sender,
            "NFT HANDLER: Not the NFT owner"
        );

        // Get the associated position IDs for the given token ID
        bytes32[] memory positionIds = _tokenIds[tokenId];

        // Check if all position IDs exist in the GMXFactory contract
        for (uint256 i = 0; i < positionIds.length; i++) {
            uint256[] memory data = gmxFactoryContract.getPosition(
                positionIds[i]
            );
            require(
                data[0] != 0,
                "NFT HANDLER: Position does not or already closed"
            );
            require(
                gmxFactoryContract.getPositionOwner(positionIds[i]) ==
                    msg.sender,
                "NFT HANDLER: Not a position owner"
            );
        }

        // Transfer the NFT using the PositionNFT contract
        positionNFTContract.safeTransferFrom(msg.sender, to, tokenId);
        for (uint256 i = 0; i < positionIds.length; i++) {
            address gmxAdapter = gmxFactoryContract.getPositionAdapter(
                positionIds[i]
            );
            require(
                _changeOwnerOfAdapter(gmxAdapter, to) == true,
                "NFT HANDLER: Error while changing the position owner from adapter"
            );
            require(
                gmxFactoryContract.updateOwner(
                    msg.sender,
                    to,
                    positionIds[i]
                ) == true,
                "NFT HANDLER: Error while changing the position owner from gmx factory"
            );
            emit NftTransferred(tokenId, to);
        }
    }

    /**
     * @dev Change Ownership of Adapter contract.
     *
     * @param _gmxAdapter The address of the adapter contract.
     * @param _newOwner The address of the new owner of that position.
     */
    function _changeOwnerOfAdapter(
        address _gmxAdapter,
        address _newOwner
    ) internal returns (bool) {
        gmxAdapterContract = IGMXAdapter(_gmxAdapter);
        gmxAdapterContract.changePositonOwner(_newOwner);
        return true;
    }

    /**
     * @dev Set the base URI for the NFT contract.
     *
     * @param _uri The new base URI for the NFT contract.
     */
    function setBaseUri(string memory _uri) external onlyOwner returns (bool) {
        positionNFTContract.setBaseURI(_uri);
        return true;
    }
}
