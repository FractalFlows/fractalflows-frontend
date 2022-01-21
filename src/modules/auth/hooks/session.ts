import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";
import { Session } from "../interfaces";

export const getSession = async () => {
  //TODO: add loading session state to global cache
  try {
    const session = await AuthService.getSession();
    AuthCache.session(session);
    AuthCache.isSignedIn(true);
  } catch (e: any) {
    AuthCache.session({} as Session);
    AuthCache.isSignedIn(false);
  }
};

export const reloadSession = async () => {
  try {
    const session = await AuthService.getSession();
    AuthCache.session(session);
    AuthCache.isSignedIn(true);
  } catch (e: any) {
    AuthCache.session({} as Session);
    AuthCache.isSignedIn(false);
  }
};
