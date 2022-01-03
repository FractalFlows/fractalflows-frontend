import { reloadSession } from "modules/auth/hooks/session";
import { SettingsService } from "../services/settings";

export const updateEmail = async ({ email }: { email: string }) => {
  await SettingsService.updateEmail({ email });
  reloadSession();
};
