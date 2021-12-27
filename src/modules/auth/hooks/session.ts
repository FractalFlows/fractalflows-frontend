import type { SiweMessage } from "siwe";

import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

export const getSession = async () => {
  const siweMessage = (await AuthService.getSession()) as SiweMessage;

  if (siweMessage) {
    AuthCache.sessionVar({ siweMessage });
    AuthCache.isSignedInVar(true);
  }
};
