// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import "./ClaimFractionalizer.sol";

contract Claim is ERC721URIStorage {
  mapping(uint => address) private _fractionalizationContracts;
  mapping(uint => uint[]) private _knowledgeBits;
  mapping(uint => mapping(uint => uint)) private _knowledgeBitsIndexes;

  constructor() ERC721("Fractal Flows Claims", "FFC") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken (string memory metadataURI, uint tokenId) public {
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);

    ClaimFractionalizer claimFractionalizer = new ClaimFractionalizer(
      "Fractal Flows Claim Fractionalizer",
      string(abi.encodePacked("FFCF-", Strings.toString(tokenId)))
    );
    _fractionalizationContracts[tokenId] = address(claimFractionalizer);

    claimFractionalizer.mint(msg.sender, 25 * 10 ** 18);
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function addKnowledgeBit(uint tokenId, uint knowledgeBitTokenId, address sender) external {
    require(_exists(tokenId), "Claim doesn't exist.");
    require(_knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] == 0, "Knowledge bit has already been added to claim.");
    
    _knowledgeBits[tokenId].push(knowledgeBitTokenId);
    _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] = _knowledgeBits[tokenId].length;

    ClaimFractionalizer(_fractionalizationContracts[tokenId]).mint(sender, 50 * 10 ** 18);
  }

  function fractionalizationContractOf(uint tokenId) public view virtual returns (address) {
    return _fractionalizationContracts[tokenId];
  }

  function knowledgeBitsOf(uint tokenId) public view virtual returns (uint[] memory) {
    return _knowledgeBits[tokenId];
  }  
}
