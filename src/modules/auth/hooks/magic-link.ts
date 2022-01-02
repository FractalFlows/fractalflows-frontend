import { AuthCache } from "../cache";
import { AuthService } from "../services/auth";

export const sendMagicLink = async ({ email }: { email: string }) =>
  await AuthService.sendMagicLink({ email });

export const verifyMagicLink = async ({ hash }: { hash: string }) => {
  const user = await AuthService.verifyMagicLink({ hash });

  AuthCache.sessionVar({
    user,
  });
  AuthCache.isSignedInVar(true);

  return user;
};
