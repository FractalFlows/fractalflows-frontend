const { expect } = require("chai");

describe("Claim", function () {
  it("should return correct name", async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory(
      "contracts/Claim.sol:Claim"
    );
    const ClaimContract = await ClaimContractFactory.deploy();

    await ClaimContract.deployed();

    expect(await ClaimContract.name()).to.equal("Fractal Flows Claims");
    expect(await ClaimContract.symbol()).to.equal("FFC");
  });

  it("should mint NFT", async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory(
      "contracts/Claim.sol:Claim"
    );
    const ClaimContract = await ClaimContractFactory.deploy();

    const claimMetadataCID =
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";

    await ClaimContract.deployed();

    const claimTokenId = Math.ceil(Math.random() * Math.pow(10, 11));
    const mintClaimTx = await ClaimContract.mintToken(
      claimMetadataCID,
      claimTokenId
    );
    const mintClaimTxReceipt = await mintClaimTx.wait();
    const mintedClaimTokenId = parseInt(mintClaimTxReceipt.events[0].topics[3]);
    const mintedClaimTokenURI = await ClaimContract.tokenURI(claimTokenId);

    expect(mintedClaimTokenId).to.equal(claimTokenId);
    expect(mintedClaimTokenURI).to.equal(`ipfs://${claimMetadataCID}`);
  });
});
