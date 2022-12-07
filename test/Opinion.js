const { expect } = require("chai");
const { generateNFTId, convertBigNumbersToNumber } = require("./utils");

const metadataCID =
  "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";

const deployOpinionContract = async () => {
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
    ClaimContract.address
  );
  await ArgumentContract.deployed();

  const OpinionContractFactory = await hre.ethers.getContractFactory(
    "contracts/Opinion.sol:Opinion"
  );
  const OpinionContract = await OpinionContractFactory.deploy(
    ClaimContract.address
  );
  await OpinionContract.deployed();

  return {
    ClaimContract,
    KnowledgeBitContract,
    ArgumentContract,
    OpinionContract,
  };
};

const deployOpinionContractAndMintNFT = async (
  metadataCID = "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json"
) => {
  const {
    ClaimContract,
    KnowledgeBitContract,
    ArgumentContract,
    OpinionContract,
  } = await deployOpinionContract();

  const claimTokenId = generateNFTId();
  const mintClaimTokenTx = await ClaimContract.mintToken(
    metadataCID,
    claimTokenId,
    {
      tokenURI:
        "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json",
      fee: 1e11,
    }
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

  const opinionTokenId = generateNFTId();
  const opinionTokenTx = await OpinionContract.mintToken(
    metadataCID,
    opinionTokenId,
    [argumentTokenId],
    claimTokenId
  );
  await opinionTokenTx.wait();

  return {
    ClaimContract,
    KnowledgeBitContract,
    ArgumentContract,
    OpinionContract,
    claimTokenId,
    knowledgeBitTokenId,
    argumentTokenId,
    opinionTokenId,
  };
};

describe("Opinion", function () {
  it("should return correct name", async function () {
    const { OpinionContract } = await deployOpinionContract();

    expect(await OpinionContract.name()).to.equal("Fractal Flows Opinions");
    expect(await OpinionContract.symbol()).to.equal("FFO");
  });

  it("should mint NFT", async function () {
    const {
      ClaimContract,
      OpinionContract,
      claimTokenId,
      argumentTokenId,
      opinionTokenId,
    } = await deployOpinionContractAndMintNFT(metadataCID);

    const opinionTokenURI = await OpinionContract.tokenURI(opinionTokenId);
    const opinionArgumentTokenIds = await OpinionContract.argumentsOf(
      opinionTokenId
    );
    const claimOpinionTokenIds = await ClaimContract.opinionsOf(claimTokenId);

    expect(convertBigNumbersToNumber(claimOpinionTokenIds))
      .to.be.an("array")
      .and.have.same.members([opinionTokenId]);
    expect(convertBigNumbersToNumber(opinionArgumentTokenIds))
      .to.be.an("array")
      .and.have.same.members([argumentTokenId]);
    expect(opinionTokenURI).to.equal(`ipfs://${metadataCID}`);
  });

  it("should NOT mint NFT if claim doesn't exist", async function () {
    const { OpinionContract, argumentTokenId } =
      await deployOpinionContractAndMintNFT();

    await expect(
      OpinionContract.mintToken(
        metadataCID,
        generateNFTId(),
        [argumentTokenId],
        generateNFTId()
      )
    ).to.be.revertedWith("Claim doesn't exist");
  });

  it("should NOT mint NFT if attached argument doesn't exist", async function () {
    const { OpinionContract, claimTokenId, argumentTokenId } =
      await deployOpinionContractAndMintNFT(metadataCID);

    const unexistingArgumentTokenId = generateNFTId();

    await expect(
      OpinionContract.mintToken(
        metadataCID,
        generateNFTId(),
        [argumentTokenId, unexistingArgumentTokenId],
        claimTokenId
      )
    ).to.be.revertedWith(
      `Argument ${unexistingArgumentTokenId} doesn't belong to claim ${claimTokenId}`
    );
  });

  it("should update NFT metadata and arguments", async function () {
    const {
      ArgumentContract,
      OpinionContract,
      claimTokenId,
      knowledgeBitTokenId,
      argumentTokenId,
      opinionTokenId,
    } = await deployOpinionContractAndMintNFT(metadataCID);

    const updatedMetadataCID =
      "bafyreihcjrcrr4tqzplgorev7x3f32w2z57ta6qz5ekhtvdcpyy7xurf3a/metadata.json";

    const argumentTokenId2 = generateNFTId();
    const mintArgumentTokenTx2 = await ArgumentContract.mintToken(
      metadataCID,
      argumentTokenId2,
      [knowledgeBitTokenId],
      claimTokenId
    );
    await mintArgumentTokenTx2.wait();

    const argumentTokenIds = [argumentTokenId, argumentTokenId2];

    await OpinionContract.setTokenURI(
      opinionTokenId,
      updatedMetadataCID,
      argumentTokenIds
    );
    const opinionArgumentTokenIds = await OpinionContract.argumentsOf(
      opinionTokenId
    );
    const opinionTokenURI = await OpinionContract.tokenURI(opinionTokenId);

    expect(convertBigNumbersToNumber(opinionArgumentTokenIds))
      .to.be.an("array")
      .and.have.same.members(argumentTokenIds);
    expect(opinionTokenURI).to.equal(`ipfs://${updatedMetadataCID}`);
  });
});
