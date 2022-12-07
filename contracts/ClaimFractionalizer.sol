// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
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

  function createNftWithErc20(
    NftCreateData calldata _NftCreateData,
    ErcCreateData calldata _ErcCreateData
  ) external returns (address, address);
}

interface OceanERC20Template {
  function createFixedRate(
    address fixedPriceAddress,
    address[] memory addresses,
    uint256[] memory uints
  ) external returns (bytes32);
}

contract ClaimFractionalizer is ERC20, IERC721Receiver, Ownable {
  struct OceanListing {
    string tokenURI;
    uint256 fee;
  }

  constructor(uint256 claimTokenId, OceanListing memory _OceanListing)
    ERC20(
      "Fractal Flows Claim Fractionalizer",
      string(abi.encodePacked("FFCF-", Strings.toString(claimTokenId)))
    )
  {
    address baseToken = 0x819b194B69bC7a56c0571C2C5520c594eFab2793; // FFDST
    address marketAddress = 0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1; // FF address

    OceanERC721Factory.NftCreateData memory _NftCreateData = OceanERC721Factory
      .NftCreateData(
        "Fractal Flows Data NFT",
        string(abi.encodePacked("FFDN-", Strings.toString(claimTokenId))),
        1,
        _OceanListing.tokenURI,
        false,
        address(this)
      );

    string[] memory _ErcCreateDataStrings = new string[](2);
    _ErcCreateDataStrings[0] = "Fractal Flows Data Token"; // name
    _ErcCreateDataStrings[1] = string(
      abi.encodePacked("FFDT-", Strings.toString(claimTokenId))
    ); // symbol

    address[] memory _ErcCreateDataAddresses = new address[](4);
    _ErcCreateDataAddresses[0] = address(this); // data tokens minter
    _ErcCreateDataAddresses[1] = address(this); // payment collector
    _ErcCreateDataAddresses[2] = marketAddress; // publishing market
    _ErcCreateDataAddresses[3] = baseToken; // market fee token

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
    _FixedDataAddresses[0] = baseToken; // base token
    _FixedDataAddresses[1] = address(this); // owner
    _FixedDataAddresses[2] = marketAddress; // market fee collector
    _FixedDataAddresses[3] = address(0); // allowed swapper, this is overriden by the contract

    uint256[] memory _FixedDataUints = new uint256[](5);
    _FixedDataUints[0] = 18; // base token decimals
    _FixedDataUints[1] = 18; // data token decimals
    _FixedDataUints[2] = _OceanListing.fee; // fee
    _FixedDataUints[3] = 1e18 / 1e4; // swap fee
    _FixedDataUints[4] = 1; // withMint

    OceanERC721Factory.FixedData memory _FixedData = OceanERC721Factory
      .FixedData(
        0xc313e19146Fc9a04470689C9d41a4D3054693531, // fixed price contract address
        _FixedDataAddresses,
        _FixedDataUints
      );

    address nftAddress;
    address datatokenAddress;

    (nftAddress, datatokenAddress, ) = OceanERC721Factory(
      address(0xe8c6Dc39602031A152440311e364818ba25C2Bc1)
    ).createNftWithErc20WithFixedRate(
        _NftCreateData,
        _ErcCreateData,
        _FixedData
      );
  }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount * 10**uint256(decimals()));
  }

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes memory _data
  ) public pure override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}
