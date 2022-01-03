import { reloadSession } from "modules/auth/hooks/session";
import { UpdateProfileProps } from "../interfaces";
import { SettingsService } from "../services/settings";

export const updateProfile = async (profile: UpdateProfileProps) => {
  await SettingsService.updateProfile(profile);
  reloadSession();
};
