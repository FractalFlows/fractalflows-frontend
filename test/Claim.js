const { expect } = require("chai");

describe("Claim", function () {
  it("should return correct name", async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory("Claim");
    const ClaimContract = await ClaimContractFactory.deploy();

    await ClaimContract.deployed();

    expect(await ClaimContract.name()).to.equal("Fractal Flows Claims");
    expect(await ClaimContract.symbol()).to.equal("FFC");
  });

  it("should mint NFT", async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory("Claim");
    const ClaimContract = await ClaimContractFactory.deploy();

    const claimMetadataCID =
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";

    await ClaimContract.deployed();
    const mintClaimTx = await ClaimContract.mintToken(claimMetadataCID);
    const mintClaimTxReceipt = await mintClaimTx.wait();
    const tokenId = parseInt(mintClaimTxReceipt.events[1].topics[3]);
    const tokenURI = await ClaimContract.tokenURI(tokenId);

    expect(tokenId).to.equal(0);
    expect(tokenURI).to.equal(`ipfs://${claimMetadataCID}`);
  });
});
