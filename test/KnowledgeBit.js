const { expect } = require("chai");

const deployKnowledgeBitContract = async () => {
  const ClaimContractFactory = await hre.ethers.getContractFactory(
    "contracts/Claim.sol:Claim"
  );
  const ClaimContract = await ClaimContractFactory.deploy();

  await ClaimContract.deployed();

  const KnowledgeBitContractFactory = await hre.ethers.getContractFactory(
    "contracts/KnowledgeBit.sol:KnowledgeBit"
  );
  const KnowledgeBitContract = await KnowledgeBitContractFactory.deploy(
    ClaimContract.address
  );

  await KnowledgeBitContract.deployed();

  return { ClaimContract, KnowledgeBitContract };
};

const deployKnowledgeBitContractAndMintNFT = async (
  metadataCID = "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json"
) => {
  const { ClaimContract, KnowledgeBitContract } =
    await deployKnowledgeBitContract();

  const claimTokenId = Math.ceil(Math.random() * Math.pow(10, 11));
  const mintClaimTokenTx = await ClaimContract.mintToken(
    metadataCID,
    claimTokenId
  );

  await mintClaimTokenTx.wait();

  const knowledgeBitTokenId = Math.ceil(Math.random() * Math.pow(10, 11));
  const mintKnowledgeBitTokenTx = await KnowledgeBitContract.mintToken(
    metadataCID,
    knowledgeBitTokenId,
    claimTokenId
  );
  await mintKnowledgeBitTokenTx.wait();

  return {
    ClaimContract,
    KnowledgeBitContract,
    claimTokenId,
    knowledgeBitTokenId,
  };
};

describe("Knowledge Bit", function () {
  it("should return correct name", async function () {
    const { KnowledgeBitContract } = await deployKnowledgeBitContract();

    expect(await KnowledgeBitContract.name()).to.equal(
      "Fractal Flows Knowledge Bits"
    );
    expect(await KnowledgeBitContract.symbol()).to.equal("FFKB");
  });

  it.only("should mint NFT", async function () {
    const metadataCID =
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";
    const {
      ClaimContract,
      KnowledgeBitContract,
      claimTokenId,
      knowledgeBitTokenId,
    } = await deployKnowledgeBitContractAndMintNFT(metadataCID);

    const tokenURI = await KnowledgeBitContract.tokenURI(knowledgeBitTokenId);
    const claimKnowledgeBitTokenIds = await ClaimContract.knowledgeBitsOf(
      claimTokenId
    );

    expect(
      claimKnowledgeBitTokenIds.map((claimKnowledgeBitTokenId) =>
        claimKnowledgeBitTokenId.toNumber()
      )
    )
      .to.be.an("array")
      .that.include(knowledgeBitTokenId);
    expect(tokenURI).to.equal(`ipfs://${metadataCID}`);
  });

  it("should upvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.upvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Upvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    expect(upvotesCount.toNumber() + 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should upvote removing existing downvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvoteTx = await KnowledgeBitContract.downvote(knowledgeBitTokenId);
    await downvoteTx.wait();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );
    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.upvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Upvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );
    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    expect(upvotesCount.toNumber() + 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
    expect(downvotesCount.toNumber() - 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });

  it("should downvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.downvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Downvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    expect(downvotesCount.toNumber() + 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });

  it("should downvote removing existing upvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvoteTx = await KnowledgeBitContract.upvote(knowledgeBitTokenId);
    await upvoteTx.wait();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );
    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.downvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Downvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );
    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    expect(downvotesCount.toNumber() + 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
    expect(upvotesCount.toNumber() - 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should unvote removing existing upvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvoteTx = await KnowledgeBitContract.upvote(knowledgeBitTokenId);
    await upvoteTx.wait();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.unvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Unvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      knowledgeBitTokenId
    );

    expect(upvotesCount.toNumber() - 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should unvote removing existing downvote", async function () {
    const { KnowledgeBitContract, knowledgeBitTokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvoteTx = await KnowledgeBitContract.downvote(knowledgeBitTokenId);
    await downvoteTx.wait();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    await expect(KnowledgeBitContract.unvote(knowledgeBitTokenId))
      .to.emit(KnowledgeBitContract, "Unvote")
      .withArgs(knowledgeBitTokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      knowledgeBitTokenId
    );

    expect(downvotesCount.toNumber() - 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });
});
