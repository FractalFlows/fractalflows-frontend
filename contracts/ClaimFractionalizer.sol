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
  constructor(
    string memory symbol,
    OceanERC721Factory.NftCreateData memory _NftCreateData,
    OceanERC721Factory.ErcCreateData memory _ErcCreateData,
    OceanERC721Factory.FixedData memory _FixedData
  ) ERC20("Fractal Flows Claim Fractionalizer", symbol) {
    _NftCreateData.owner = address(this);
    _ErcCreateData.addresses[0] = address(this);
    _ErcCreateData.addresses[1] = address(this);
    _FixedData.addresses[1] = address(this);

    OceanERC721Factory(0xe8c6Dc39602031A152440311e364818ba25C2Bc1)
      .createNftWithErc20WithFixedRate(
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
