const { expect } = require("chai");
const { BigNumber, utils } = require("ethers");
const { generateNFTId } = require("./utils");

const deployFFDSTContract = async () => {
  const FFDSTContractFactory = await hre.ethers.getContractFactory(
    "contracts/FFDST.sol:FFDST"
  );
  const FFDSTContract = await FFDSTContractFactory.deploy();
  await FFDSTContract.deployed();

  return {
    FFDSTContract,
  };
};

describe("FFDST", function () {
  it("should return correct name, symbol and balance", async function () {
    const [signer] = await ethers.getSigners();
    const { FFDSTContract } = await deployFFDSTContract();

    const balance = await FFDSTContract.balanceOf(signer.address);
    const expectedBalance = BigNumber.from("1000000000000000000000000000");

    expect(await FFDSTContract.name()).to.equal(
      "Fractal Flows Decentralized Science Token"
    );
    expect(await FFDSTContract.symbol()).to.equal("FFDST");
    expect(balance.eq(expectedBalance)).to.equal(true);
  });

  it.only("should transfer tokens to a contract", async function () {
    const [signer] = await ethers.getSigners();
    const { FFDSTContract } = await deployFFDSTContract();

    const ClaimContractFactory = await hre.ethers.getContractFactory(
      "contracts/Claim.sol:Claim"
    );
    const ClaimContract = await ClaimContractFactory.deploy();
    await ClaimContract.deployed();

    const claimTokenId = generateNFTId();
    const mintClaimTx = await ClaimContract.mintToken(
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json",
      claimTokenId,
      1e11
    );
    await mintClaimTx.wait();

    const fractionalizationContractAddress =
      await ClaimContract.fractionalizationContractOf(claimTokenId);

    const amount = utils.parseEther("1.0");
    const sendTx = await FFDSTContract.send(
      fractionalizationContractAddress,
      amount,
      "0x"
    );
    await sendTx.wait();

    const balance = await FFDSTContract.balanceOf(
      fractionalizationContractAddress
    );

    expect(balance.eq(amount)).to.equal(true);
  });
});
