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

  it("should transfer tokens to a contract", async function () {
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

  it.only("should split payments and release due payments", async function () {
    const [signer, signer2] = await ethers.getSigners();
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

    const KnowledgeBitContractFactory = await hre.ethers.getContractFactory(
      "contracts/KnowledgeBit.sol:KnowledgeBit"
    );
    const KnowledgeBitContract = await KnowledgeBitContractFactory.deploy(
      ClaimContract.address
    );

    await KnowledgeBitContract.deployed();

    const knowledgeBitTokenId = generateNFTId();
    const mintKnowledgeBitTokenTx = await KnowledgeBitContract.mintToken(
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json",
      knowledgeBitTokenId,
      claimTokenId
    );
    await mintKnowledgeBitTokenTx.wait();

    const knowledgeBitTokenId2 = generateNFTId();
    const mintKnowledgeBitTokenTx2 = await KnowledgeBitContract.connect(
      signer2
    ).mintToken(
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json",
      knowledgeBitTokenId2,
      claimTokenId
    );
    await mintKnowledgeBitTokenTx2.wait();

    const fractionalizationContractAddress =
      await ClaimContract.fractionalizationContractOf(claimTokenId);
    const ClaimFractionalizationContractFactory =
      await hre.ethers.getContractFactory(
        "contracts/ClaimFractionalizer.sol:ClaimFractionalizer"
      );
    const ClaimFractionalizationContract =
      await ClaimFractionalizationContractFactory.attach(
        fractionalizationContractAddress
      );

    const amount = utils.parseEther("100.0");
    const sendTx = await FFDSTContract.send(
      fractionalizationContractAddress,
      amount,
      "0x"
    );
    await sendTx.wait();

    const releasable = await ClaimFractionalizationContract.releasable(
      FFDSTContract.address,
      signer.address
    );
    const releasable2 = await ClaimFractionalizationContract.releasable(
      FFDSTContract.address,
      signer2.address
    );

    const releaseTx = await ClaimFractionalizationContract.release(
      FFDSTContract.address,
      signer2.address
    );
    releaseTx.wait();

    const releasable2Updated = await ClaimFractionalizationContract.releasable(
      FFDSTContract.address,
      signer2.address
    );
    const balance = await FFDSTContract.balanceOf(signer2.address);

    // console.log(releasable2, balance, releasable2Updated);

    expect(balance.eq(releasable2)).to.equal(true);
    expect(releasable2Updated.eq(0)).to.equal(true);
  });
});
