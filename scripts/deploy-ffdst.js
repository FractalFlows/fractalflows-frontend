async function main() {
  const FFDSTContractFactory = await hre.ethers.getContractFactory(
    "contracts/FFDST.sol:FFDST"
  );
  const FFDSTContract = await FFDSTContractFactory.deploy();
  await FFDSTContract.deployed();

  console.log("Deployed FFDST contract to:", FFDSTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
