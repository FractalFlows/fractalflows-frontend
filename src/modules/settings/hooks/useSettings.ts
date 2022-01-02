import { getAPIKey, generateAPIKey, removeAPIKey } from "./apiKeys";
import { connectEthereumWallet } from "./web3connection";
import { updateEmail } from "./email";

export const useSettings = () => {
  return {
    updateEmail,
    connectEthereumWallet,
    getAPIKey,
    generateAPIKey,
    removeAPIKey,
  };
};
