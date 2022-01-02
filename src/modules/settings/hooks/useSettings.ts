import { getAPIKey, generateAPIKey, removeAPIKey } from "./apiKeys";
import { updateEmail } from "./email";

export const useSettings = () => {
  return {
    updateEmail,
    getAPIKey,
    generateAPIKey,
    removeAPIKey,
  };
};
