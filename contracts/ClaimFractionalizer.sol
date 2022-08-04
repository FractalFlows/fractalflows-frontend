// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

contract ClaimFractionalizer is ERC20, IERC721Receiver {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(msg.sender, 25);
  }

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes memory _data
  ) public pure override returns(bytes4) {
    return this.onERC721Received.selector;
  }
}
