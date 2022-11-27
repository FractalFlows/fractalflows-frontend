// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

interface Claim {
  function addArgument(uint, uint, address) external;
  function addArgumentComment(uint, address) external;
  function knowledgeBitIndexOf(uint, uint) external view returns (uint);
  function claimOfArgument(uint) external view returns (uint);
}

contract Argument is ERC721URIStorage {
  address private _claimContractAddress;

  struct Comment {
    address owner;
    string uri;
  }

  mapping(uint => uint[]) private _knowledgeBits;
  mapping(uint => Comment[]) private _comments;

  event AddComment(uint, uint, address);
  event UpdateComment(uint, uint, address);

  modifier argumentExists(uint tokenId) {
    require(_exists(tokenId), "Argument doesn't exist");
    _;
  }

  constructor(
    address claimContractAddress
  ) ERC721("Fractal Flows Arguments", "FFA") {
    _claimContractAddress = claimContractAddress;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function _checkIfKnowledgeBitIdsBelongToClaim(uint claimTokenId, uint[] memory knowledgeBitIds) private view {
    for (uint i = 0; i < knowledgeBitIds.length; i++) {
      require(
        Claim(_claimContractAddress).knowledgeBitIndexOf(claimTokenId, knowledgeBitIds[i]) != 0,
        string(abi.encodePacked(
          "Knowledge bit ",
          Strings.toString(knowledgeBitIds[i]),
          " doesn't belong to claim ",
          Strings.toString(claimTokenId)
        ))
      );
    }
  }

  function mintToken (
    string memory metadataURI,
    uint tokenId,
    uint[] memory knowledgeBitIds,
    uint claimTokenId
  ) public {
    _checkIfKnowledgeBitIdsBelongToClaim(claimTokenId, knowledgeBitIds);

    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);
    
    _knowledgeBits[tokenId] = knowledgeBitIds;

    Claim(_claimContractAddress).addArgument(claimTokenId, tokenId, msg.sender);
  }

  function setTokenURI(uint tokenId, string memory metadataURI, uint[] memory knowledgeBitIds) public {
    uint claimTokenId = Claim(_claimContractAddress).claimOfArgument(tokenId);

    _checkIfKnowledgeBitIdsBelongToClaim(claimTokenId, knowledgeBitIds);

    _setTokenURI(tokenId, metadataURI);
    _knowledgeBits[tokenId] = knowledgeBitIds;
  }

  function addComment(uint tokenId, string memory metadataURI) public argumentExists(tokenId) {
    Comment memory comment = Comment(msg.sender, metadataURI);
    _comments[tokenId].push(comment);

    uint claimTokenId = Claim(_claimContractAddress).claimOfArgument(tokenId);

    Claim(_claimContractAddress).addArgumentComment(claimTokenId, msg.sender);

    emit AddComment(tokenId, _comments[tokenId].length - 1, msg.sender);
  }

  function updateComment(uint tokenId, uint commentIndex, string memory metadataURI) public argumentExists(tokenId) {
    Comment memory comment = Comment(msg.sender, metadataURI);
    _comments[tokenId][commentIndex] = comment;

    emit UpdateComment(tokenId, _comments[tokenId].length - 1, msg.sender);
  }

  function knowledgeBitsOf(uint tokenId) public view virtual returns (uint[] memory) {
    return _knowledgeBits[tokenId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override virtual {
    require(from == address(0), "Token transfer is blocked");   
    super._beforeTokenTransfer(from, to, tokenId);  
  }
}
