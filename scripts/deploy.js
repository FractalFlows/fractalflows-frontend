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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
