// SPDX-License-Identifier: Apache-2.0 OR MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

interface Claim {
  function addOpinion(uint, uint, address) external;
  function argumentIndexOf(uint, uint) external view returns (uint);
  function claimOfOpinion(uint) external view returns (uint);
}

contract Opinion is ERC721URIStorage {
  address private _claimContractAddress;

  mapping(uint => uint[]) private _arguments;

  constructor(
    address claimContractAddress
  ) ERC721("Fractal Flows Opinions", "FFO") {
    _claimContractAddress = claimContractAddress;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://";
  }

  function _checkIfArgumentIdsBelongToClaim(uint claimTokenId, uint[] memory argumentIds) private view {
    for (uint i = 0; i < argumentIds.length; i++) {
      require(
        Claim(_claimContractAddress).argumentIndexOf(claimTokenId, argumentIds[i]) != 0,
        string(abi.encodePacked(
          "Argument ",
          Strings.toString(argumentIds[i]),
          " doesn't belong to claim ",
          Strings.toString(claimTokenId)
        ))
      );
    }
  }

  function mintToken (
    string memory metadataURI,
    uint tokenId,
    uint[] memory argumentIds,
    uint claimTokenId
  ) public {
    _checkIfArgumentIdsBelongToClaim(claimTokenId, argumentIds);

    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);
    
    _arguments[tokenId] = argumentIds;

    Claim(_claimContractAddress).addOpinion(claimTokenId, tokenId, msg.sender);
  }

  function setTokenURI(uint tokenId, string memory metadataURI, uint[] memory argumentIds) public {
    uint claimTokenId = Claim(_claimContractAddress).claimOfOpinion(tokenId);

    _checkIfArgumentIdsBelongToClaim(claimTokenId, argumentIds);

    _setTokenURI(tokenId, metadataURI);
    _arguments[tokenId] = argumentIds;
  }

  function argumentsOf(uint tokenId) public view virtual returns (uint[] memory) {
    return _arguments[tokenId];
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override virtual {
    require(from == address(0), "Token transfer is blocked");   
    super._beforeTokenTransfer(from, to, tokenId);  
  }
}
