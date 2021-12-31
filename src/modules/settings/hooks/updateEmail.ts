import { merge } from "lodash-es";

import { AuthCache } from "modules/auth/cache";
import { SettingsService } from "../services/settings";

export const updateEmail = async ({ email }: { email: string }) => {
  const user = await SettingsService.updateEmail({ email });

  const sessionVar = merge({}, AuthCache.sessionVar(), {
    user: { email },
  });
  AuthCache.sessionVar(sessionVar);

  return user;
};
