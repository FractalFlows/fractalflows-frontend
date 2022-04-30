
async function main() {
  const ClaimContractFactory = await hre.ethers.getContractFactory("Claim");
  const ClaimContract = await ClaimContractFactory.deploy();

  await ClaimContract.deployed();

  console.log("Deployed Claim contract to:", ClaimContract.address)
}

main().then(() => process.exit(0)).catch((error) => {
  console.log(error)
  process.exit(1)
})
