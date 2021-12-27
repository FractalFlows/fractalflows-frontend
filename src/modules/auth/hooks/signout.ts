import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";

export const signout = async () => {
  await AuthService.signout();

  AuthCache.sessionVar({});
  AuthCache.isSignedInVar(false);
};
