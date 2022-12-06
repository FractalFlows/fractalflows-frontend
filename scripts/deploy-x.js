async function main() {
  const [signer] = await hre.ethers.getSigners();

  const ClaimContractFactory = await hre.ethers.getContractFactory(
    "contracts/ClaimFractionalizer.sol:ClaimFractionalizer"
  );
  const NftCreateData = {
    name: "aa",
    symbol: "b",
    templateIndex: "1",
    tokenURI: "123",
    transferable: false,
    owner: "0x0000000000000000000000000000000000000000",
  };
  const ErcCreateData = {
    templateIndex: "2",
    strings: ["aa", "bb"],
    addresses: [
      signer.address,
      signer.address,
      "0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1",
      "0x819b194B69bC7a56c0571C2C5520c594eFab2793", // base token FFDST
    ],
    uints: ["1000", "10"],
    bytess: [],
  };
  const FixedData = {
    fixedPriceAddress: "0xc313e19146Fc9a04470689C9d41a4D3054693531",
    addresses: [
      "0x819b194B69bC7a56c0571C2C5520c594eFab2793",
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
    ],
    uints: ["18", "18", 1e11, 1e18 / 1e4, "0"],
  };

  const ClaimContract = await ClaimContractFactory.deploy("a", "b");
  await ClaimContract.deployed();

  const a = await ClaimContract.c(NftCreateData, ErcCreateData, FixedData);
  await a.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
