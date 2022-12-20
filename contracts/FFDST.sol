// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract FFDST is ERC777 {
  constructor()
    ERC777(
      "Fractal Flows Decentralized Science Token",
      "FFDST",
      new address[](0)
    )
  {
    _mint(msg.sender, 1000000000 * 10**uint256(decimals()), "", "");
  }
}
