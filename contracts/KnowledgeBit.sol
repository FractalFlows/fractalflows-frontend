// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface Claim {
  function addKnowledgeBit(uint, uint) external;
}

contract KnowledgeBit is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  event Upvote(uint, address);
  event Downvote(uint, address);
  event Unvote(uint, address);

  mapping(uint => mapping(address => int)) private _votes;
  mapping(uint => uint) private _downvotesCount;
  mapping(uint => uint) private _upvotesCount;

  address private _claimContractAddress;

  constructor(address claimContractAddress) ERC721("Fractal Flows Knowledge Bits", "FFKB") {
    _claimContractAddress = claimContractAddress;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken (string memory metadataURI, uint claimTokenId) public returns (uint) {
    uint newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, metadataURI);

    _tokenIds.increment();
    
    Claim(_claimContractAddress).addKnowledgeBit(claimTokenId, newTokenId);

    return newTokenId;
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function upvote (uint tokenId) public {
    require(_votes[tokenId][msg.sender] != 1, "You have already upvoted this knowledge bit.");

    if (_votes[tokenId][msg.sender] == -1) {
      _downvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = 1; 
    _upvotesCount[tokenId] += 1;

    emit Upvote(tokenId, msg.sender);
  }

  function downvote (uint tokenId) public {
    require(_votes[tokenId][msg.sender] != -1, "You have already downvoted this knowledge bit.");

    if (_votes[tokenId][msg.sender] == 1) {
      _upvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = -1; 
    _downvotesCount[tokenId] += 1;

    emit Downvote(tokenId, msg.sender);
  }

  function unvote (uint tokenId) public {
    if (_votes[tokenId][msg.sender] == 1) {
      _upvotesCount[tokenId] -= 1;
    } else if (_votes[tokenId][msg.sender] == -1) {
      _downvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = 0;

    emit Unvote(tokenId, msg.sender);
  }

  function upvotesCountOf(uint tokenId) public view virtual returns (uint) {
    return _upvotesCount[tokenId];
  }

  function downvotesCountOf(uint tokenId) public view virtual returns (uint) {
    return _downvotesCount[tokenId];
  }
}