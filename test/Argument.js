const { expect } = require("chai");
const { generateNFTId, convertBigNumbersToNumber } = require("./utils");

const metadataCID =
  "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";

const deployArgumentContract = async () => {
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

  const ArgumentContractFactory = await hre.ethers.getContractFactory(
    "contracts/Argument.sol:Argument"
  );
  const ArgumentContract = await ArgumentContractFactory.deploy(
    ClaimContract.address,
    KnowledgeBitContract.address
  );
  await ArgumentContract.deployed();

  return { ClaimContract, KnowledgeBitContract, ArgumentContract };
};

const deployArgumentContractAndMintNFT = async (
  metadataCID = "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json"
) => {
  const { ClaimContract, KnowledgeBitContract, ArgumentContract } =
    await deployArgumentContract();

  const claimTokenId = generateNFTId();
  const mintClaimTokenTx = await ClaimContract.mintToken(
    metadataCID,
    claimTokenId
  );
  await mintClaimTokenTx.wait();

  const knowledgeBitTokenId = generateNFTId();
  const mintKnowledgeBitTokenTx = await KnowledgeBitContract.mintToken(
    metadataCID,
    knowledgeBitTokenId,
    claimTokenId
  );
  await mintKnowledgeBitTokenTx.wait();

  const argumentTokenId = generateNFTId();
  const argumentTokenTx = await ArgumentContract.mintToken(
    metadataCID,
    argumentTokenId,
    [knowledgeBitTokenId],
    claimTokenId
  );
  await argumentTokenTx.wait();

  return {
    ClaimContract,
    KnowledgeBitContract,
    ArgumentContract,
    claimTokenId,
    knowledgeBitTokenId,
    argumentTokenId,
  };
};

describe("Argument", function () {
  it("should return correct name", async function () {
    const { ArgumentContract } = await deployArgumentContract();

    expect(await ArgumentContract.name()).to.equal("Fractal Flows Arguments");
    expect(await ArgumentContract.symbol()).to.equal("FFA");
  });

  it("should mint NFT", async function () {
    const metadataCID =
      "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";
    const {
      ClaimContract,
      ArgumentContract,
      claimTokenId,
      knowledgeBitTokenId,
      argumentTokenId,
    } = await deployArgumentContractAndMintNFT(metadataCID);

    const argumentTokenURI = await ArgumentContract.tokenURI(argumentTokenId);
    const argumentKnowledgeBitTokenIds = await ArgumentContract.knowledgeBitsOf(
      argumentTokenId
    );
    const claimArgumentTokenIds = await ClaimContract.argumentsOf(claimTokenId);

    expect(convertBigNumbersToNumber(claimArgumentTokenIds))
      .to.be.an("array")
      .and.have.same.members([argumentTokenId]);
    expect(convertBigNumbersToNumber(argumentKnowledgeBitTokenIds))
      .to.be.an("array")
      .and.have.same.members([knowledgeBitTokenId]);
    expect(argumentTokenURI).to.equal(`ipfs://${metadataCID}`);
  });

  it("should NOT mint NFT if claim doesn't exist", async function () {
    const { ArgumentContract, knowledgeBitTokenId } =
      await deployArgumentContractAndMintNFT();

    await expect(
      ArgumentContract.mintToken(
        metadataCID,
        generateNFTId(),
        [knowledgeBitTokenId],
        generateNFTId()
      )
    ).to.be.revertedWith("Claim doesn't exist");
  });

  it("should NOT mint NFT if attached knowledge bit doesn't exist", async function () {
    const {
      ArgumentContract,
      claimTokenId,
      knowledgeBitTokenId,
      argumentTokenId,
    } = await deployArgumentContractAndMintNFT(metadataCID);

    const unexistingKnowledgeBitTokenId = generateNFTId();

    await expect(
      ArgumentContract.mintToken(
        metadataCID,
        argumentTokenId,
        [knowledgeBitTokenId, unexistingKnowledgeBitTokenId],
        claimTokenId
      )
    ).to.be.revertedWith(
      `Knowledge bit ${unexistingKnowledgeBitTokenId} doesn't exist`
    );
  });

  it("should update NFT metadata and knowledge bits", async function () {
    const {
      KnowledgeBitContract,
      ArgumentContract,
      claimTokenId,
      knowledgeBitTokenId,
      argumentTokenId,
    } = await deployArgumentContractAndMintNFT(metadataCID);

    const updatedMetadataCID =
      "bafyreihcjrcrr4tqzplgorev7x3f32w2z57ta6qz5ekhtvdcpyy7xurf3a/metadata.json";

    const knowledgeBitTokenId2 = generateNFTId();
    const mintKnowledgeBitTokenTx2 = await KnowledgeBitContract.mintToken(
      metadataCID,
      knowledgeBitTokenId2,
      claimTokenId
    );
    await mintKnowledgeBitTokenTx2.wait();

    const knowledgeBitTokenIds = [knowledgeBitTokenId, knowledgeBitTokenId2];

    await ArgumentContract.setTokenURI(
      argumentTokenId,
      updatedMetadataCID,
      knowledgeBitTokenIds
    );
    const argumentKnowledgeBitTokenIds = await ArgumentContract.knowledgeBitsOf(
      argumentTokenId
    );
    const argumentTokenURI = await ArgumentContract.tokenURI(argumentTokenId);

    expect(convertBigNumbersToNumber(argumentKnowledgeBitTokenIds))
      .to.be.an("array")
      .and.have.same.members(knowledgeBitTokenIds);
    expect(argumentTokenURI).to.equal(`ipfs://${updatedMetadataCID}`);
  });

  it("should add comment", async function () {
    const { ArgumentContract, argumentTokenId } =
      await deployArgumentContractAndMintNFT(metadataCID);

    const [signer] = await ethers.getSigners();

    await expect(ArgumentContract.addComment(argumentTokenId, metadataCID))
      .to.emit(ArgumentContract, "AddComment")
      .withArgs(argumentTokenId, 0, signer.address);
  });
});
