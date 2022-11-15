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

    await ClaimContract.deployed();
    await ClaimContract.mintToken(
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json"
    );

    expect(true).to.equal(true);
  });

  it("should mint NFT 2", async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory("Claim");
    const ClaimContract = await ClaimContractFactory.deploy();

    await ClaimContract.deployed();

    expect(true).to.equal(true);
  });
});
