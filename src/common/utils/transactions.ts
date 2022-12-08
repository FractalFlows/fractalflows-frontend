import { ethers } from "ethers";

export const TxEventABIs = {
  OceanNFTCreated: [
    `event NFTCreated(
      address newTokenAddress,
      address indexed templateAddress,
      string tokenName,
      address indexed admin,
      string symbol,
      string tokenURI,
      bool transferable,
      address indexed creator
    )`,
  ],
};

export const getTxLog = (logs: any[], topicHash: string) =>
  logs.find(({ topics }) => topics[0] === topicHash);

export const decodeLogParameters = (log: any, abi: string[]) => {
  const iface = new ethers.utils.Interface(abi);
  const parsedLog = iface.parseLog(log);

  return parsedLog.args;
};

export const getTxLogArgs = (logs: any[], topicHash: string, abi: string[]) => {
  const log = getTxLog(logs, topicHash);

  return decodeLogParameters(log, abi);
};

export const getTxLogTopicAsNormalizedAddress = (
  logs: any[],
  topicHash: string,
  index: number
) => normalizeAddressFromTxLog(getTxLog(logs, topicHash).topics[index]);

export const normalizeAddressFromTxLog = (address: string) =>
  `0x${address.substr(-40)}`;

export const generateNFTId = () => Math.ceil(Math.random() * Math.pow(10, 7));
