// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PectraPosition} from "./PectraPosition.sol";
import {GMXAdapterProxy} from "../Proxy/GMXAdapterProxy.sol";
import {IPectraAdapter} from "./interfaces/IPectraAdapter.sol";

contract PectraFactoryV1 is Ownable {
  enum PositionType {
    Long,
    Short,
    Pair
  }
  PectraPosition public spectraPosition;

  mapping(bytes32 => address) public adapters;
  mapping(uint256 => address) public tradePositionProxies;

  constructor(
    address _gmxRouter,
    address _gmxPositionRouter
  ) {
    spectraPosition = new PectraPosition(
      _getSelector(getPositionSize.selector),
      _getSelector(getPositionPnL.selector)
    );

    GMXAdapterProxy gmxAdapterProxy = new GMXAdapterProxy(_gmxRouter, _gmxPositionRouter);
    adapters[_stringToBytes32("gmx")] = gmxAdapter;
  }

  function openPosition(
    PositionType positionType,
    string memory adapter,
    address collateralAsset,
    address positionAsset,
    bytes[] memory initData,
    bytes[] memory callData
  ) external payable {
    bytes32 adapterIdentifier = _stringToBytes32(adapter);
    address adapterAddress = adapters[adapterIdentifier];

    require(adapterAddress != address(0), "ADAPTER NOT FOUND");
    require(collateralAsset != positionAsset, "ASSET1 CANNOT EQUAL ASSET2");

    uint256 positionId = _mintPosition(
      positionType,
      collateralAsset,
      positionAsset
    );

    IGMXAdapter adapter = _deployAdapter(
      adapterAddress, 
      positionId,
      initData
    );

    adapter.openPosition(callData);
  }

  function closePosition(
    uint256 positionTokenId
  ) external {
      address adapterProxyAddress = tradePositionProxies[positionTokenId];
      require(adapterProxyAddress != address(0), "INVALID POSITION TOKEN ID");
      require(msg.sender == spectraPosition.ownerOf(positionTokenId), "INVALID SENDER");

      // TODO: close from adapter

      spectraPosition.burnPosition(positionTokenId);
      delete tradePositionProxies[positionTokenId];
  }

  function addAdapter(string memory identifier, address _address) external onlyOwner {
    bytes32 normalizedIdentifier = _stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] == address(0), "ADAPTER ALREADY REGISTERD");
    adapters[normalizedIdentifier] = _address;
  }

  function removeAdapter(string memory identifier) external onlyOwner {
    bytes32 normalizedIdentifier = _stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] != address(0), "ADAPTER DOESN'T EXIST");
    delete adapters[normalizedIdentifier];
  }

  function updateAdapter(string memory identifier, address _address) external onlyOwner { 
    bytes32 normalizedIdentifier = _stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] != address(0), "ADAPTER DOESN'T EXIST");
    adapters[normalizedIdentifier] = _address;
  }

  function getPositionSize(uint256 tokenId) public view returns (uint256) {
    //address positionProxyAddress = tradePositionProxies[tokenId];
    //IGMXAdapter adapterProxy = new IGMXAdapter(positionProxyAddress);
    //return adapterProxy.getPositionSize();
    return 0;
  }

  function getPositionPnL(uint256 tokenId) public view returns (uint256) {
    //address positionProxyAddress = tradePositionProxies[tokenId];
    //IGMXAdapter adapterProxy = new IGMXAdapter(positionProxyAddress);
    //return adapterProxy.getPositionPnL();
    return 0;
  }

  function _mintPosition(
    PositionType positionType,
    address collateralAsset,
    address positionAsset,
  ) internal returns (uint256) {
    bytes memory _positionType;
    bytes memory _positionName;
    bytes memory _positionDescription;

    if (positionType == PositionType.Long) {
      _positionType = "LONG";
    } else if (positionType == PositionType.Short) {
      _positionType = "SHORT";
    } else if (positionType == PositionType.Pair) {
      _positionType = "PAIR";
    } else {
      revert("INVALID TRADE TYPE");
    }
    _positionName = abi.encodePacked(_positionType, ": ", collateralAsset, "/", positionAsset);
    _positionDescription = abi.encodePacked("This is a ", _positionType, " position on: ", adapter, " with assets: ", collateralAsset, "/", positionAsset);

    uint256 positionTokenId = spectraPosition.mintPosition(msg.sender, string(_positionName), string(_positionDescription));

    return positionTokenId;
  }

  function _deployAdapter(
    address adapterAddress,
    uint256 positionTokenId,
    bytes[] memory initData
  ) internal returns (IPectraAdapter) {
    ERC1967Proxy adapterProxy = new ERC1967Proxy(adapterAddress, "");
    IPectraAdapter adapterInterface = new IPectraAdapter(adapterProxy);

    adapterInterface.initialize(initData);
    tradePositionProxies[positionTokenId] = address(adapterProxy);

    return adapterInterface;
  }

  function _stringToBytes32(string memory source) private pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
      }

      assembly {
          result := mload(add(source, 32))
      }
  }

  function _getSelector(string calldata _func) private pure returns (bytes memory) {
        return abi.encodeWithSignature(_func);
  }
}
