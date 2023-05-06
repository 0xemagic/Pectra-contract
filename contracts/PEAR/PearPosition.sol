// //Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.17;

// import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

// contract PectraPosition is ERC721Enumerable, Ownable {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;

//     // Token Metadata
//     mapping(uint256 => string) public tokenIdToPositionName;
//     mapping(uint256 => string) public tokenIdToPositionDescription;
//     bytes public positionSizeFunctionSelector;
//     bytes public positionPnLFunctionSelector;

//     constructor(
//         bytes memory getPositionSizeFunctionSelector,
//         bytes memory getPositionPnlFunctionSelector
//     ) ERC721("PECTRA POSITION", "PECTRA") 
//       Ownable() {
//             positionSizeFunctionSelector = getPositionSizeFunctionSelector;
//             positionPnLFunctionSelector = getPositionPnlFunctionSelector;
//         }

//     function mintPosition(
//         address recipient,
//         string positionName,
//         string positionDescription
//     ) public
//       onlyOwner
//       returns (uint256) {
//         _tokenIds.increment();
//         uint256 nextTokenId = _tokenIds.current();

//         _mint(recipient, nextTokenId);
//         tokenIdToPositionName[nextTokenId] = positionName;
//         tokenIdToPositionDescription[nextTokenId] = positionDescription;

//         return nextTokenId;
//     }

//     function burnPosition(uint256 tokenId) public onlyOwner {
//         require(_exists(tokenId), "INVALID TOKEN ID");
//         delete tokenIdToPositionName[tokenId];
//         delete tokenIdToPositionDescription[tokenId];
//         _burn(tokenId);
//     }

//     function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
//         require(_exists(tokenId), "Nonexistent token");
//         return _tokenUriForPosition(tokenId);
//     }

//     function _tokenUriForPosition(uint256 tokenId) private view returns (string memory) {
//         return string(abi.encodePacked(
//             _baseURI(),
//             Base64.encode(abi.encodePacked(
//                 '{"name":"',
//                     tokenIdToPositionName[tokenId],
//                 '","description":"',
//                     tokenIdToPositionDescription[tokenId],
//                 '","attributes":[',
//                 '],"image":"',
//                     "data:image/svg+xml;base64,", _tokenPositionSVG(tokenId),
//                 '"}'
//             ))
//         ));
//     } 

//     function _tokenPositionSVG(uint256 tokenId) private view returns (string memory) {
//         string memory positionName = tokenIdToPositionName[tokenId];
//         string memory positionDescription = tokenIdToPositionDescription[tokenId];
//         (bool sizeCallSuccess, bytes memory sizeCallResult) = owner().staticcall(positionSizeFunctionSelector, tokenId);
//         (bool pnlCallSuccess, bytes memory pnlCallResult) = owner().staticcall(positionPnLFunctionSelector, tokenId);
//         if (!sizeCallSuccess || !pnlCallSuccess) {
//             return "";
//         }
//         uint256 positionSize = uint256(bytes32(sizeCallResult));
//         uint256 positionPnL = uint256(bytes32(pnlCallResult));

//         // TODO: Embed positionName, positionDescription, positionSize, and positionPnL into an SVG string
//         return "";
//     }

//     function _baseURI() internal pure virtual override returns (string memory) {
//         return "data:application/json;base64,";
//     }
// }
