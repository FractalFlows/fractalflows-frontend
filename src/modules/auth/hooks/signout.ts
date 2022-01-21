import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";
import { Session } from "../interfaces";

export const signout = async () => {
  await AuthService.signout();

  AuthCache.session({} as Session);
  AuthCache.isSignedIn(false);
};
