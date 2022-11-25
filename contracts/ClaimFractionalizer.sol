// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClaimFractionalizer is ERC20, Ownable {

  constructor(string memory name, string memory symbol) ERC20(name, symbol) { }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount * 10**uint(decimals()));
  }
}
