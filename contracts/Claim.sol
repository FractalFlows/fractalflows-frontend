// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "./ClaimFractionalizer.sol";

contract Claim is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint => uint[]) private _knowledgeBits;
  mapping(uint => mapping(uint => uint)) private _knowledgeBitsIndexes;

  constructor() ERC721("Fractal Flows Claims", "FFC") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken (string memory metadataURI) public returns (uint256) {
    uint256 newTokenId = _tokenIds.current();

    ClaimFractionalizer claimFractionalizer = new ClaimFractionalizer(
      "Fractal Flows Claim Fractionalizer",
      string(abi.encodePacked("FFC-", Strings.toString(newTokenId)))
    );

    _safeMint(address(claimFractionalizer), newTokenId);
    _setTokenURI(newTokenId, metadataURI);

    _tokenIds.increment();

    return newTokenId;
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function addKnowledgeBit(uint tokenId, uint knowledgeBitTokenId) public {
    require(_exists(tokenId), "Claim NFT doesn't exist.");
    require(_knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] == 0, "Knowledge bit has already been added to claim.");
    
    _knowledgeBits[tokenId].push(knowledgeBitTokenId);
    _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] = _knowledgeBits[tokenId].length;
  }

  function knowledgeBitsOf(uint tokenId) public view virtual returns (uint[] memory) {
    return _knowledgeBits[tokenId];
  }
}
