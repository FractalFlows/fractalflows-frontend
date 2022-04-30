const { expect } = require('chai')

describe('Claim', function () {
  it('should return correct name', async function () {
    const ClaimContractFactory = await hre.ethers.getContractFactory("Claim")
    const ClaimContract = await ClaimContractFactory.deploy("Fractal Flows Claims", "FFC")

    await ClaimContract.deployed();

    expect(await ClaimContract.name()).to.equal("Fractal Flows Claims")
    expect(await ClaimContract.symbol()).to.equal("FFC")
  })
})
