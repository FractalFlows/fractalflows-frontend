import { getAPIKey, createAPIKey, removeAPIKey } from "./apiKeys";
import { connectEthereumWallet } from "./web3connection";
import { updateProfile } from "./profile";
import { SettingsService } from "../services/settings";
import { reloadSession } from "modules/auth/hooks/session";

const updateEmail = async ({
  verificationCode,
}: {
  verificationCode: string;
}) => {
  await SettingsService.updateEmail({ verificationCode });
  reloadSession();
};

const sendUpdateEmailVerificationCode = async ({
  email,
}: {
  email: string;
}) => {
  const verificationCode =
    await SettingsService.sendUpdateEmailVerificationCode({
      email,
    });
  return verificationCode;
};

export const useSettings = () => {
  return {
    updateProfile,
    updateEmail,
    sendUpdateEmailVerificationCode,
    connectEthereumWallet,
    getAPIKey,
    createAPIKey,
    removeAPIKey,
  };
};
