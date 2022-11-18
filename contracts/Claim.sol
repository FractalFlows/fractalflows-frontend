pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "./ClaimFractionalizer.sol";

contract Claim is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Fractal Flows Claims", "FFC") {}

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function mintToken (string memory metadataURI) public returns (uint256) {
    uint256 newTokenId = _tokenIds.current();

    ClaimFractionalizer claimFractionalizer = new ClaimFractionalizer(
      "Fractal Flows Claim Fractionalizer",
      string(abi.encodePacked("FFC-", Strings.toString(newTokenId)))
    );

    _safeMint(address(claimFractionalizer), newTokenId);
    _setTokenURI(newTokenId, metadataURI);

    _tokenIds.increment();

    return newTokenId;
  }

  function setTokenURI(uint tokenId, string memory metadataURI) public {
    _setTokenURI(tokenId, metadataURI);
  }
}
