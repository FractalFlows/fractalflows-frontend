const { expect } = require("chai");
const { generateNFTId, convertBigNumbersToNumber } = require("./utils");

const metadataCID =
  "bafyreih36wt6w6bpfuvdabj572gjbqxbd4gb3xihc5tq7rdz6wrcmhtsgi/metadata.json";

describe("Fractionalizer", function () {
  it.only("should return correct name", async function () {
    const [signer] = await ethers.getSigners();

    const ClaimContractFactory = await hre.ethers.getContractFactory(
      "contracts/ClaimFractionalizer.sol:ClaimFractionalizer"
    );
    const NftCreateData = {
      name: "aa",
      symbol: "b",
      templateIndex: 1,
      tokenURI: "123",
      transferable: false,
      owner: "0x0000000000000000000000000000000000000000",
    };
    const ErcCreateData = {
      templateIndex: 2,
      strings: ["aa", "bb"],
      addresses: [
        signer.address,
        signer.address,
        "0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1",
        "0x819b194b69bc7a56c0571c2c5520c594efab2793", // base token FFDST
      ],
      uints: ["1000", "10"],
      bytess: [],
    };
    // const FixedData = {
    //   fixedPriceAddress: "0xc313e19146Fc9a04470689C9d41a4D3054693531",
    //   addresses: [
    //     "0x819b194b69bc7a56c0571c2c5520c594efab2793",
    //     "0x05585ed45a9db5e3d0623c2e6dcdea4aae04ebe1",
    //     "0x05585ed45a9db5e3d0623c2e6dcdea4aae04ebe1",
    //   ],
    //   uints: ["18", "18", "10", "0", "1"],
    // };
    const ClaimContract = await ClaimContractFactory.deploy("a", "b");
    await ClaimContract.deployed();

    const a = await ClaimContract.a(NftCreateData, ErcCreateData);
    const aR = await a.wait();
    const [c, d] = aR.events[aR.events.length - 1].args;
    console.log(c, d);

    const FixedData = {
      fixedPriceAddress: "0xc313e19146Fc9a04470689C9d41a4D3054693531",
      addresses: [
        "0xCfDdA22C9837aE76E0faA845354f33C62E03653a",
        ClaimContract.address,
        ClaimContract.address,
      ],
      uints: ["18", "18", "10", "0", "1"],
    };

    const b = await ClaimContract.b(d, FixedData);
    const bR = await b.wait();

    // await ClaimContract.a(FixedData);
  });

  it("a", async function () {
    const { ethers } = require("hardhat");

    const ABI = [
      `struct NftCreateData {
    string name;
    string symbol;
    uint256 templateIndex;
    string tokenURI;
    bool transferable;
    address owner;
  }
  
  struct ErcCreateData {
    uint256 templateIndex;
    string[] strings;
    address[] addresses;
    uint256[] uints;
    bytes[] bytess;
  }
  
  struct FixedData {
    address fixedPriceAddress;
    address[] addresses;
    uint256[] uints;
  }
  
  function createNftWithErc20WithFixedRate(
    NftCreateData calldata _NftCreateData,
    ErcCreateData calldata _ErcCreateData,
    FixedData calldata _FixedData
  )
    external
    returns (
      address,
      address,
      bytes32
    );`,
    ];

    // use HardHat config
    const [signer] = await ethers.getSigners();
    const { provider } = signer;

    // use plain Ethers.js
    // const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_KEY);
    // const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // console.log("provider:", provider);

    // works with plain Ethers.js, but fails with "cannot estimate gas"... with HardHat
    const contract = new ethers.Contract(
      "0xe8c6Dc39602031A152440311e364818ba25C2Bc1",
      ABI,
      provider /* or signer */
    );

    // expectation:
    // id 0 should throw an error with code CALL_EXCEPTION and reason "ERC721: owner query for nonexistent token",
    // ids 1 to 8888 should return its owner's address
    const NftCreateData = {
      name: "aa",
      symbol: "b",
      templateIndex: 1,
      tokenURI: "123",
      transferable: false,
      owner: "0x0000000000000000000000000000000000000000",
    };
    const ErcCreateData = {
      templateIndex: 2,
      strings: ["aa", "bb"],
      addresses: [
        signer.address,
        signer.address,
        "0x05585Ed45a9Db5e3d0623c2E6DCdea4aaE04EBe1",
        "0x819b194b69bc7a56c0571c2c5520c594efab2793", // base token FFDST
      ],
      uints: ["1000", "10"],
      bytess: [],
    };
    const FixedData = {
      fixedPriceAddress: "0xc313e19146Fc9a04470689C9d41a4D3054693531",
      addresses: [
        "0x819b194b69bc7a56c0571c2c5520c594efab2793",
        "0x05585ed45a9db5e3d0623c2e6dcdea4aae04ebe1",
        "0x05585ed45a9db5e3d0623c2e6dcdea4aae04ebe1",
      ],
      uints: ["18", "18", "10", "0", "1"],
    };

    const id = 0;
    const a = await contract.createNftWithErc20WithFixedRate(
      NftCreateData,
      ErcCreateData,
      FixedData
      // {
      //   gasLimit: 100000,
      // }
    );
    console.log(a);
    // giving gasLimit makes no difference
    // console.log("Owner is:", owner);
  });
});
