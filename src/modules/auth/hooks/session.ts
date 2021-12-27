import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

export const getSession = async () => {
  try {
    const session = await AuthService.getSession();
    AuthCache.sessionVar(session);
    AuthCache.isSignedInVar(true);
  } catch (e) {
    AuthCache.sessionVar({});
    AuthCache.isSignedInVar(false);
  }
};
