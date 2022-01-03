import { getAPIKey, generateAPIKey, removeAPIKey } from "./apiKeys";
import { connectEthereumWallet } from "./web3connection";
import { updateEmail } from "./email";
import { updateProfile } from "./profile";

export const useSettings = () => {
  return {
    updateProfile,
    updateEmail,
    connectEthereumWallet,
    getAPIKey,
    generateAPIKey,
    removeAPIKey,
  };
};
