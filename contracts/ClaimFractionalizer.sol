// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
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
  event A(address, address);

  constructor(string memory name, string memory symbol)
    public
    ERC20(name, symbol)
  {}

  function c(
    OceanERC721Factory.NftCreateData memory _NftCreateData,
    OceanERC721Factory.ErcCreateData memory _ErcCreateData,
    OceanERC721Factory.FixedData memory _FixedData
  ) public {
    address c;
    address d;
    // bytes32 c;

    _NftCreateData.owner = address(this);
    _FixedData.addresses[1] = address(this);
    _FixedData.addresses[2] = address(this);

    (c, d, ) = OceanERC721Factory(
      address(0xe8c6Dc39602031A152440311e364818ba25C2Bc1)
    ).createNftWithErc20WithFixedRate(
        _NftCreateData,
        _ErcCreateData,
        _FixedData
      );

    console.log(c);
    console.log(d);

    emit A(c, d);
  }

  function a(
    OceanERC721Factory.NftCreateData memory _NftCreateData,
    OceanERC721Factory.ErcCreateData memory _ErcCreateData
  ) public {
    address c;
    address d;
    // bytes32 c;

    _NftCreateData.owner = address(this);

    (c, d) = OceanERC721Factory(
      address(0xe8c6Dc39602031A152440311e364818ba25C2Bc1)
    ).createNftWithErc20(_NftCreateData, _ErcCreateData);

    console.log(c);
    console.log(d);

    emit A(c, d);
  }

  function b(address template, OceanERC721Factory.FixedData memory _FixedData)
    public
  {
    OceanERC20Template(address(template)).createFixedRate(
      _FixedData.fixedPriceAddress,
      _FixedData.addresses,
      _FixedData.uints
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
