import { reloadSession } from "modules/auth/hooks/useAuth";
import { UpdateProfileProps } from "../interfaces";
import { SettingsService } from "../services/settings";

export const updateProfile = async (profile: UpdateProfileProps) => {
  await SettingsService.updateProfile(profile);
  reloadSession();
};
