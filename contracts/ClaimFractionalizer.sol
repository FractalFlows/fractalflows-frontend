// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface OceanERC721Factory {
  struct NftCreateData {
    string name;
    string symbol;
    uint256 templateIndex;
    string tokenURI;
    bool transferable;
    address owner;
  }

  struct ErcCreateData {
    uint256 templateIndex;
    string[] strings;
    address[] addresses;
    uint256[] uints;
    bytes[] bytess;
  }

  struct FixedData {
    address fixedPriceAddress;
    address[] addresses;
    uint256[] uints;
  }

  function createNftWithErc20WithFixedRate(
    NftCreateData calldata _NftCreateData,
    ErcCreateData calldata _ErcCreateData,
    FixedData calldata _FixedData
  )
    external
    returns (
      address,
      address,
      bytes32
    );
}

interface OceanERC721Template {
  struct MetaDataProof {
    address validatorAddress;
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  struct MetaDataAndTokenURI {
    uint8 metaDataState;
    string metaDataDecryptorUrl;
    string metaDataDecryptorAddress;
    bytes flags;
    bytes data;
    bytes32 metaDataHash;
    uint256 tokenId;
    string tokenURI;
    MetaDataProof[] metadataProofs;
  }

  function setMetaDataAndTokenURI(
    MetaDataAndTokenURI calldata _MetaDataAndTokenURI
  ) external;
}

contract ClaimFractionalizer is
  ERC20,
  IERC721Receiver,
  IERC777Recipient,
  Ownable
{
  IERC1820Registry private _erc1820 =
    IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
  bytes32 private constant TOKENS_RECIPIENT_INTERFACE_HASH =
    keccak256("ERC777TokensRecipient");

  address oceanNFTAddress;
  address oceanDatatokenAddress;

  constructor(
    string memory symbol,
    OceanERC721Factory.NftCreateData memory _NftCreateData,
    OceanERC721Factory.ErcCreateData memory _ErcCreateData,
    OceanERC721Factory.FixedData memory _FixedData
  ) ERC20("Fractal Flows Claim Fractionalizer", symbol) {
    _erc1820.setInterfaceImplementer(
      address(this),
      TOKENS_RECIPIENT_INTERFACE_HASH,
      address(this)
    );

    _NftCreateData.owner = address(this);
    _ErcCreateData.addresses[0] = address(this);
    _ErcCreateData.addresses[1] = address(this);
    _FixedData.addresses[1] = address(this);

    (oceanNFTAddress, oceanDatatokenAddress, ) = OceanERC721Factory(
      0xe8c6Dc39602031A152440311e364818ba25C2Bc1
    ).createNftWithErc20WithFixedRate(
        _NftCreateData,
        _ErcCreateData,
        _FixedData
      );
  }

  function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount * 10**uint256(decimals()));
  }

  function setOceanNFTMetadataAndTokenURI(
    OceanERC721Template.MetaDataAndTokenURI calldata _MetaDataAndTokenURI
  ) external onlyOwner {
    OceanERC721Template(oceanNFTAddress).setMetaDataAndTokenURI(
      _MetaDataAndTokenURI
    );
  }

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes memory _data
  ) public pure override returns (bytes4) {
    return this.onERC721Received.selector;
  }

  function tokensReceived(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes calldata userData,
    bytes calldata operatorData
  ) external {
    console.log("tokens received!");
  }
}
