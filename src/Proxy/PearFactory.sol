// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PectraPosition} from "./PectraPosition.sol";
import {GMXAdapter} from "../GMX/library.sol";
import {IGMXAdapter} from "../GMX/Interfaces/IGMXAdapter.sol";

contract PectraFactory is Ownable {
  address public immutable NATIVE_TOKEN_IDENTIFIER;
  enum PositionType {
    OpenLong,
    OpenShort,
    OpenPairsTrade
  }
  PectraPosition public spectraPosition;

  mapping(bytes32 => address) public adapters;
  mapping(uint256 => address) public tradePositionProxies;

  constructor() {
    NATIVE_TOKEN_IDENTIFIER = address(0);

    spectraPosition = new PectraPosition(
      getSelector(getPositionSize.selector),
      getSelector(getPositionPnL.selector)
    );
    GMXAdapter gmxAdapter = new GMXAdapter();
    adapters[stringToBytes32("gmx-adapter")] = gmxAdapter;
  }

  function openTrade(
    PositionType positionType,
    string memory adapter,
    address asset1,
    address asset2
  ) external payable {
    bytes32 adapterIdentifier = stringToBytes32(adapter);
    address adapterAddress = adapters[adapterIdentifier];

    require(adapterAddress != address(0), "ADAPTER NOT FOUND");
    require(asset1 != asset2, "ASSET1 CANNOT EQUAL ASSET2");

    bytes memory _positionType;
    bytes memory _positionName;
    bytes memory _positionDescription;

    if (positionType == PositionType.OpenLong) {
      _positionType = "LONG";
    } else if (positionType == PositionType.OpenShort) {
      _positionType = "SHORT";
    } else if (positionType == PositionType.OpenPairsTrade) {
      _positionType = "PAIR";
    } else {
      revert("INVALID TRADE TYPE");
    }
    _positionName = abi.encodePacked(_positionType, ": ", asset1, "/", asset2);
    _positionDescription = abi.encodePacked("This is a ", _positionType, " position on: ", adapter, " with assets: ", asset1, "/", asset2);

    uint256 positionTokenId = spectraPosition.mintPosition(msg.sender, string(_positionName), string(_positionDescription));
    ERC1967Proxy adapterProxy = new ERC1967Proxy(adapterAddress, "");
    IGMXAdapter adapterInterface = new IGMXAdapter(adapterProxy);

    adapterInterface.initialize();
    tradePositionProxies[positionTokenId] = address(adapterProxy);

    if (positionType == PositionType.OpenLong) {
      adapterInterface.openLong(asset1, asset2);
    } else if (positionType == PositionType.OpenShort) {
      adapterInterface.openShort(asset1, asset2);
    } else if (positionType == PositionType.OpenPairsTrade) {
      adapterInterface.openPairsTrade(asset1, asset2);
    }
  }

  function closeTrade(
    uint256 positionTokenId
  ) external {
      address adapterProxyAddress = tradePositionProxies[positionTokenId];
      require(adapterProxyAddress != address(0), "INVALID POSITION TOKEN ID");
      require(msg.sender == spectraPosition.ownerOf(positionTokenId), "INVALID SENDER");

      IGMXAdapter adapterInterface = IGMXAdapter(adapterProxyAddress);
      adapterInterface.close(positionTokenId);

      spectraPosition.burnPosition(positionTokenId);
      delete tradePositionProxies[positionTokenId];
  }

  function addAdapter(string memory identifier, address _address) external onlyOwner {
    bytes32 normalizedIdentifier = stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] == address(0), "ADAPTER ALREADY REGISTERD");
    adapters[normalizedIdentifier] = _address;
  }

  function removeAdapter(string memory identifier) external onlyOwner {
    bytes32 normalizedIdentifier = stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] != address(0), "ADAPTER DOESN'T EXIST");
    delete adapters[normalizedIdentifier];
  }

  function updateAdapter(string memory identifier, address _address) external onlyOwner { 
    bytes32 normalizedIdentifier = stringToBytes32(identifier);
    require(adapters[normalizedIdentifier] != address(0), "ADAPTER DOESN'T EXIST");
    adapters[normalizedIdentifier] = _address;
  }


  function getPositionSize(uint256 tokenId) public view returns (uint256) {
    address positionProxyAddress = tradePositionProxies[tokenId];
    IGMXAdapter adapterProxy = new IGMXAdapter(positionProxyAddress);
    return adapterProxy.getPositionSize();
  }

  function getPositionPnL(uint256 tokenId) public view returns (uint256) {
    address positionProxyAddress = tradePositionProxies[tokenId];
    IGMXAdapter adapterProxy = new IGMXAdapter(positionProxyAddress);
    return adapterProxy.getPositionPnL();
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
      }

      assembly {
          result := mload(add(source, 32))
      }
  }

  function getSelector(string calldata _func) private pure returns (bytes memory) {
        return abi.encodeWithSignature(_func);
  }
}
