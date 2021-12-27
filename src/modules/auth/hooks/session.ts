import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

export const getSession = async () => {
  const session = await AuthService.getSession();

  if (session) {
    AuthCache.sessionVar(session);
    AuthCache.isSignedInVar(true);
  }
};
