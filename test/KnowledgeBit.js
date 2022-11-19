const { expect } = require("chai");

const deployKnowledgeBitContract = async () => {
  const ClaimContractFactory = await hre.ethers.getContractFactory(
    "contracts/Claim.sol:Claim"
  );
  const ClaimContract = await ClaimContractFactory.deploy();

  await ClaimContract.deployed();

  const KnowledgeBitContractFactory = await hre.ethers.getContractFactory(
    "KnowledgeBit"
  );
  const KnowledgeBitContract = await KnowledgeBitContractFactory.deploy(
    ClaimContract.address,
    {}
  );

  await KnowledgeBitContract.deployed();

  return { ClaimContract, KnowledgeBitContract };
};

const deployKnowledgeBitContractAndMintNFT = async (
  metadataCID = "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json"
) => {
  const { ClaimContract, KnowledgeBitContract } =
    await deployKnowledgeBitContract();

  const mintClaimTokenTx = await ClaimContract.mintToken(metadataCID);
  const mintClaimTokenTxReceipt = await mintClaimTokenTx.wait();
  const claimTokenId = parseInt(mintClaimTokenTxReceipt.events[1].topics[3]);

  const mintKnowledgeBitTokenTx = await KnowledgeBitContract.mintToken(
    metadataCID,
    claimTokenId
  );
  const mintKnowledgeBitTokenTxReceipt = await mintKnowledgeBitTokenTx.wait();
  const knowledgeBitTokenId = parseInt(
    mintKnowledgeBitTokenTxReceipt.events[0].topics[3]
  );

  return { KnowledgeBitContract, tokenId: knowledgeBitTokenId };
};

describe("Knowledge Bit", function () {
  it("should return correct name", async function () {
    const { KnowledgeBitContract } = await deployKnowledgeBitContract();

    expect(await KnowledgeBitContract.name()).to.equal(
      "Fractal Flows Knowledge Bits"
    );
    expect(await KnowledgeBitContract.symbol()).to.equal("FFKB");
  });

  it("should mint NFT", async function () {
    const metadataCID =
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT(metadataCID);

    const tokenURI = await KnowledgeBitContract.tokenURI(tokenId);

    expect(tokenId).to.equal(0);
    expect(tokenURI).to.equal(`ipfs://${metadataCID}`);
  });

  it("should upvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.upvote(tokenId))
      .to.emit(KnowledgeBitContract, "Upvote")
      .withArgs(tokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      tokenId
    );

    expect(upvotesCount.toNumber() + 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should upvote removing existing downvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvoteTx = await KnowledgeBitContract.downvote(tokenId);
    await downvoteTx.wait();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(tokenId);
    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.upvote(tokenId))
      .to.emit(KnowledgeBitContract, "Upvote")
      .withArgs(tokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      tokenId
    );
    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      tokenId
    );

    expect(upvotesCount.toNumber() + 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
    expect(downvotesCount.toNumber() - 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });

  it("should downvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.downvote(tokenId))
      .to.emit(KnowledgeBitContract, "Downvote")
      .withArgs(tokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      tokenId
    );

    expect(downvotesCount.toNumber() + 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });

  it("should downvote removing existing upvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvoteTx = await KnowledgeBitContract.upvote(tokenId);
    await upvoteTx.wait();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(tokenId);
    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.downvote(tokenId))
      .to.emit(KnowledgeBitContract, "Downvote")
      .withArgs(tokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      tokenId
    );
    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      tokenId
    );

    expect(downvotesCount.toNumber() + 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
    expect(upvotesCount.toNumber() - 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should unvote removing existing upvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const upvoteTx = await KnowledgeBitContract.upvote(tokenId);
    await upvoteTx.wait();

    const upvotesCount = await KnowledgeBitContract.upvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.unvote(tokenId))
      .to.emit(KnowledgeBitContract, "Unvote")
      .withArgs(tokenId, account.address);

    const updatedUpvotesCount = await KnowledgeBitContract.upvotesCountOf(
      tokenId
    );

    expect(upvotesCount.toNumber() - 1).to.equal(
      updatedUpvotesCount.toNumber()
    );
  });

  it("should unvote removing existing downvote", async function () {
    const { KnowledgeBitContract, tokenId } =
      await deployKnowledgeBitContractAndMintNFT();
    const [account] = await ethers.getSigners();

    const downvoteTx = await KnowledgeBitContract.downvote(tokenId);
    await downvoteTx.wait();

    const downvotesCount = await KnowledgeBitContract.downvotesCountOf(tokenId);

    await expect(KnowledgeBitContract.unvote(tokenId))
      .to.emit(KnowledgeBitContract, "Unvote")
      .withArgs(tokenId, account.address);

    const updatedDownvotesCount = await KnowledgeBitContract.downvotesCountOf(
      tokenId
    );

    expect(downvotesCount.toNumber() - 1).to.equal(
      updatedDownvotesCount.toNumber()
    );
  });
});
