const generateNFTId = () => Math.ceil(Math.random() * Math.pow(10, 7));
const convertBigNumbersToNumber = (bns) => bns.map((bn) => bn.toNumber());

module.exports = {
  generateNFTId,
  convertBigNumbersToNumber,
};
