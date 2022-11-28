async function main() {
  const ClaimContractFactory = await hre.ethers.getContractFactory(
    "contracts/Claim.sol:Claim"
  );
  const ClaimContract = await ClaimContractFactory.deploy();
  await ClaimContract.deployed();

  console.log("Deployed Claim contract to:", ClaimContract.address);

  const KnowledgeBitContractFactory = await hre.ethers.getContractFactory(
    "contracts/KnowledgeBit.sol:KnowledgeBit"
  );
  const KnowledgeBitContract = await KnowledgeBitContractFactory.deploy(
    ClaimContract.address
  );
  await KnowledgeBitContract.deployed();

  console.log(
    "Deployed Knowledge Bit contract to:",
    KnowledgeBitContract.address
  );

  const ArgumentContractFactory = await hre.ethers.getContractFactory(
    "contracts/Argument.sol:Argument"
  );
  const ArgumentContract = await ArgumentContractFactory.deploy(
    ClaimContract.address
  );
  await ArgumentContract.deployed();

  console.log("Deployed Argument contract to:", ArgumentContract.address);

  const OpinionContractFactory = await hre.ethers.getContractFactory(
    "contracts/Opinion.sol:Opinion"
  );
  const OpinionContract = await OpinionContractFactory.deploy(
    ClaimContract.address
  );
  await OpinionContract.deployed();

  console.log("Deployed Opinion contract to:", OpinionContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
