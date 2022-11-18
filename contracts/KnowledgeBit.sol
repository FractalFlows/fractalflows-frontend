pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "./Claim.sol";

contract KnowledgeBit is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => mapping(address => int)) private _votes;
  mapping(uint256 => uint256) private _downvotesCount;
  mapping(uint256 => uint256) private _upvotesCount;

  constructor() ERC721("Fractal Flows Knowledge Bits", "FFKB") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken (string memory metadataURI) public returns (uint256) {
    uint256 newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, metadataURI);

    _tokenIds.increment();

    return newTokenId;
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function upvote (uint256 tokenId) public {
    require(_votes[tokenId][msg.sender] != 1, "You have already upvoted this knowledge bit.");

    if (_votes[tokenId][msg.sender] == -1) {
      _downvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = 1; 
    _upvotesCount[tokenId] += 1;
  }

  function downvote (uint256 tokenId) public {
    require(_votes[tokenId][msg.sender] != -1, "You have already downvoted this knowledge bit.");

    if (_votes[tokenId][msg.sender] == 1) {
      _upvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = -1; 
    _downvotesCount[tokenId] += 1;
  }

  function unvote (uint256 tokenId) public {
    if (_votes[tokenId][msg.sender] == 1) {
      _upvotesCount[tokenId] -= 1;
    } else if (_votes[tokenId][msg.sender] == -1) {
      _downvotesCount[tokenId] -= 1;
    }

    _votes[tokenId][msg.sender] = 0; 
  }

  function upvotesCountOf(uint256 tokenId) public view virtual returns (uint256) {
    return _upvotesCount[tokenId];
  }

  function downvotesCountOf(uint256 tokenId) public view virtual returns (uint256) {
    return _downvotesCount[tokenId];
  }
}
