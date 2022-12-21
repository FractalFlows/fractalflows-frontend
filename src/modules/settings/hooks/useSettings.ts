import { getAPIKey, createAPIKey, removeAPIKey } from "./apiKeys";
import { updateProfile } from "./profile";
import { SettingsService } from "../services/settings";
import { reloadSession } from "modules/auth/hooks/useAuth";

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
    getAPIKey,
    createAPIKey,
    removeAPIKey,
  };
};
