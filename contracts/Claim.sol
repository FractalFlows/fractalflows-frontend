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
    uint256 fee
  ) public {
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);

    OceanERC721Factory.NftCreateData memory _NftCreateData = OceanERC721Factory
      .NftCreateData(
        "Fractal Flows Data NFT", // name
        string(abi.encodePacked("FFDN-", Strings.toString(tokenId))), // symbol
        1, // template
        "", // tokenURI
        false, // transferable
        address(0) // owner, overwritten by ClaimFractionalizer
      );

    string[] memory _ErcCreateDataStrings = new string[](2);
    _ErcCreateDataStrings[0] = "Fractal Flows Data Token"; // name
    _ErcCreateDataStrings[1] = string(
      abi.encodePacked("FFDT-", Strings.toString(tokenId))
    ); // symbol

    address[] memory _ErcCreateDataAddresses = new address[](4);
    _ErcCreateDataAddresses[0] = address(0); // data tokens minter, overwritten by ClaimFractionalizer
    _ErcCreateDataAddresses[1] = address(0); // payment collector, overwritten by ClaimFractionalizer
    _ErcCreateDataAddresses[2] = 0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1; // publishing market, FF wallet
    _ErcCreateDataAddresses[3] = 0x819b194B69bC7a56c0571C2C5520c594eFab2793; // market fee token, FFDST

    uint256[] memory _ErcCreateDataUints = new uint256[](2);
    _ErcCreateDataUints[0] = 1e27; // data tokens cap
    _ErcCreateDataUints[1] = 1; // market fee amount percent

    bytes[] memory _ErcCreateDataBytes;

    OceanERC721Factory.ErcCreateData memory _ErcCreateData = OceanERC721Factory
      .ErcCreateData(
        2, // template (enterprise)
        _ErcCreateDataStrings,
        _ErcCreateDataAddresses,
        _ErcCreateDataUints,
        _ErcCreateDataBytes
      );

    address[] memory _FixedDataAddresses = new address[](4);
    _FixedDataAddresses[0] = 0x819b194B69bC7a56c0571C2C5520c594eFab2793; // base token, FFDST
    _FixedDataAddresses[1] = address(0); // owner, overwritten by ClaimFractionalizer
    _FixedDataAddresses[2] = 0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1; // market fee collector, FF wallet
    _FixedDataAddresses[3] = address(0); // allowed swapper, overwritten by the Ocean contract

    uint256[] memory _FixedDataUints = new uint256[](5);
    _FixedDataUints[0] = 18; // base token decimals
    _FixedDataUints[1] = 18; // data token decimals
    _FixedDataUints[2] = fee; // fee
    _FixedDataUints[3] = 1e18 / 1e4; // swap fee
    _FixedDataUints[4] = 1; // withMint

    OceanERC721Factory.FixedData memory _FixedData = OceanERC721Factory
      .FixedData(
        0xc313e19146Fc9a04470689C9d41a4D3054693531, // fixed price contract address
        _FixedDataAddresses,
        _FixedDataUints
      );

    ClaimFractionalizer claimFractionalizer = new ClaimFractionalizer(
      string(abi.encodePacked("FFCF-", Strings.toString(tokenId))),
      _NftCreateData,
      _ErcCreateData,
      _FixedData
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
