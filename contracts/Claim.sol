// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import "./ClaimFractionalizer.sol";

contract Claim is ERC721URIStorage {
  mapping(uint256 => address) private _fractionalizationContracts;

  mapping(uint256 => uint256[]) private _knowledgeBits;
  mapping(uint256 => mapping(uint256 => uint256)) private _knowledgeBitsIndexes;

  mapping(uint256 => uint256[]) private _arguments;
  mapping(uint256 => mapping(uint256 => uint256)) private _argumentsIndexes;
  mapping(uint256 => uint256) private _argumentToClaim;

  mapping(uint256 => uint256[]) private _opinions;
  mapping(uint256 => mapping(uint256 => uint256)) private _opinionsIndexes;
  mapping(uint256 => uint256) private _opinionToClaim;

  modifier claimExists(uint256 tokenId) {
    require(_exists(tokenId), "Claim doesn't exist");
    _;
  }

  constructor() ERC721("Fractal Flows Claims", "FFC") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken(
    string memory metadataURI,
    uint256 tokenId,
    ClaimFractionalizer.OceanListing memory _OceanListing
  ) public {
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);

    ClaimFractionalizer claimFractionalizer = new ClaimFractionalizer(
      tokenId,
      _OceanListing
    );
    _fractionalizationContracts[tokenId] = address(claimFractionalizer);

    claimFractionalizer.mint(msg.sender, 50);
  }

  function setTokenURI(uint256 tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }

  function _rewardContribution(
    uint256 tokenId,
    address account,
    uint256 amount
  ) private {
    ClaimFractionalizer(_fractionalizationContracts[tokenId]).mint(
      account,
      amount
    );
  }

  function addKnowledgeBit(
    uint256 tokenId,
    uint256 knowledgeBitTokenId,
    address account
  ) external claimExists(tokenId) {
    require(
      _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] == 0,
      "Knowledge bit has already been added to claim"
    );

    _knowledgeBits[tokenId].push(knowledgeBitTokenId);
    _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId] = _knowledgeBits[
      tokenId
    ].length;

    _rewardContribution(tokenId, account, 200);
  }

  function addKnowledgeBitVote(uint256 tokenId, address account)
    external
    claimExists(tokenId)
  {
    _rewardContribution(tokenId, account, 1);
  }

  function addArgument(
    uint256 tokenId,
    uint256 argumentTokenId,
    address account
  ) external claimExists(tokenId) {
    require(
      _argumentsIndexes[tokenId][argumentTokenId] == 0,
      "Argument has already been added to claim"
    );

    _arguments[tokenId].push(argumentTokenId);
    _argumentsIndexes[tokenId][argumentTokenId] = _arguments[tokenId].length;
    _argumentToClaim[argumentTokenId] = tokenId;

    _rewardContribution(tokenId, account, 15);
  }

  function addArgumentComment(uint256 tokenId, address account)
    external
    claimExists(tokenId)
  {
    _rewardContribution(tokenId, account, 3);
  }

  function addOpinion(
    uint256 tokenId,
    uint256 opinionTokenId,
    address account
  ) external claimExists(tokenId) {
    require(
      _opinionsIndexes[tokenId][opinionTokenId] == 0,
      "Opinion has already been added to claim"
    );

    _opinions[tokenId].push(opinionTokenId);
    _opinionsIndexes[tokenId][opinionTokenId] = _opinions[tokenId].length;
    _opinionToClaim[opinionTokenId] = tokenId;

    _rewardContribution(tokenId, account, 5);
  }

  function fractionalizationContractOf(uint256 tokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (address)
  {
    return _fractionalizationContracts[tokenId];
  }

  function knowledgeBitsOf(uint256 tokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (uint256[] memory)
  {
    return _knowledgeBits[tokenId];
  }

  function knowledgeBitIndexOf(uint256 tokenId, uint256 knowledgeBitTokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (uint256)
  {
    return _knowledgeBitsIndexes[tokenId][knowledgeBitTokenId];
  }

  function argumentsOf(uint256 tokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (uint256[] memory)
  {
    return _arguments[tokenId];
  }

  function argumentIndexOf(uint256 tokenId, uint256 argumentTokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (uint256)
  {
    return _argumentsIndexes[tokenId][argumentTokenId];
  }

  function opinionsOf(uint256 tokenId)
    public
    view
    virtual
    claimExists(tokenId)
    returns (uint256[] memory)
  {
    return _opinions[tokenId];
  }

  function claimOfArgument(uint256 argumentTokenId)
    public
    view
    virtual
    returns (uint256)
  {
    return _argumentToClaim[argumentTokenId];
  }

  function claimOfOpinion(uint256 opinionTokenId)
    public
    view
    virtual
    returns (uint256)
  {
    return _opinionToClaim[opinionTokenId];
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override {
    require(from == address(0), "Token transfer is blocked");
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
