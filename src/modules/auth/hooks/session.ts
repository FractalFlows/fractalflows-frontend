import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";
import { Session } from "../interfaces";

export const getSession = async () => {
  //TODO: add loading session state to global cache
  try {
    const session = await AuthService.getSession();
    AuthCache.sessionVar(session);
    AuthCache.isSignedInVar(true);
  } catch (e) {
    AuthCache.sessionVar({} as Session);
    AuthCache.isSignedInVar(false);
  }
};

export const reloadSession = async () => {
  try {
    const session = await AuthService.getSession();
    AuthCache.sessionVar(session);
    AuthCache.isSignedInVar(true);
  } catch (e) {
    AuthCache.sessionVar({} as Session);
    AuthCache.isSignedInVar(false);
  }
};
