// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FFDST is ERC20 {
  constructor() ERC20("Fractal Flows Decentralized Science Token", "FFDST") {
    _mint(msg.sender, 1000000000 * 10**uint256(decimals()));
  }
}
