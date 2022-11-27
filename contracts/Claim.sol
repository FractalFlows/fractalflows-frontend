// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import "./ClaimFractionalizer.sol";

contract Claim is ERC721URIStorage {
  mapping(uint => address) private _fractionalizationContracts;

  mapping(uint => uint[]) private _knowledgeBits;
  mapping(uint => mapping(uint => uint)) private _knowledgeBitsIndexes;

  mapping(uint => uint[]) private _arguments;
  mapping(uint => mapping(uint => uint)) private _argumentsIndexes;
  mapping(uint => uint) private _argumentToClaim;


  mapping(uint => uint[]) private _opinions;
  mapping(uint => mapping(uint => uint)) private _opinionsIndexes;
  mapping(uint => uint) private _opinionToClaim;

  modifier claimExists(uint tokenId) {
    require(_exists(tokenId), "Claim doesn't exist");
    _;
  }

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

    claimFractionalizer.mint(msg.sender, 50);
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function _rewardContribution(uint tokenId, address account, uint amount) private {
    ClaimFractionalizer(_fractionalizationContracts[tokenId]).mint(account, amount);
  }

  function addKnowledgeBit(uint tokenId, uint knowledgeBitTokenId, address account) external claimExists(tokenId) {
    require(_knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] == 0, "Knowledge bit has already been added to claim");
    
    _knowledgeBits[tokenId].push(knowledgeBitTokenId);
    _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] = _knowledgeBits[tokenId].length;

    _rewardContribution(tokenId, account, 200);
  }

  function addKnowledgeBitVote(uint tokenId, address account) external claimExists(tokenId) {
    _rewardContribution(tokenId, account, 1);
  }

  function addArgument(uint tokenId, uint argumentTokenId, address account) external claimExists(tokenId) {
    require(_argumentsIndexes[tokenId][argumentTokenId] == 0, "Argument has already been added to claim");
    
    _arguments[tokenId].push(argumentTokenId);
    _argumentsIndexes[tokenId][argumentTokenId] = _arguments[tokenId].length;
    _argumentToClaim[argumentTokenId] = tokenId;

    _rewardContribution(tokenId, account, 15);
  }

  function addArgumentComment(uint tokenId, address account) external claimExists(tokenId) {
    _rewardContribution(tokenId, account, 3);
  }

  function addOpinion(uint tokenId, uint opinionTokenId, address account) external claimExists(tokenId) {
    require(_opinionsIndexes[tokenId][opinionTokenId] == 0, "Opinion has already been added to claim");
    
    _opinions[tokenId].push(opinionTokenId);
    _opinionsIndexes[tokenId][opinionTokenId] = _opinions[tokenId].length;
    _opinionToClaim[opinionTokenId] = tokenId;

    _rewardContribution(tokenId, account, 5);
  }

  function fractionalizationContractOf(uint tokenId) public view virtual claimExists(tokenId) returns (address) {
    return _fractionalizationContracts[tokenId];
  }

  function knowledgeBitsOf(uint tokenId) public view virtual claimExists(tokenId) returns (uint[] memory) {
    return _knowledgeBits[tokenId];
  }

  function knowledgeBitIndexOf(
    uint tokenId,
    uint knowledgeBitTokenId
  ) public view virtual claimExists(tokenId) returns (uint) {
    return _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId];
  }

  function argumentsOf(uint tokenId) public view virtual claimExists(tokenId) returns (uint[] memory) {
    return _arguments[tokenId];
  }

  function argumentIndexOf(
    uint tokenId,
    uint argumentTokenId
  ) public view virtual claimExists(tokenId) returns (uint) {
    return _argumentsIndexes[tokenId][argumentTokenId];
  }  

  function opinionsOf(uint tokenId) public view virtual claimExists(tokenId) returns (uint[] memory) {
    return _opinions[tokenId];
  }

  function claimOfArgument(uint argumentTokenId) public view virtual returns (uint) {
    return _argumentToClaim[argumentTokenId];
  }

  function claimOfOpinion(uint opinionTokenId) public view virtual returns (uint) {
    return _opinionToClaim[opinionTokenId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override virtual {
    require(from == address(0), "Token transfer is blocked");   
    super._beforeTokenTransfer(from, to, tokenId);  
  }
}
