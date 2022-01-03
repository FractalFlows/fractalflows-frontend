import { AuthCache } from "../cache";
import { AuthService } from "../services/auth";
import { reloadSession } from "./session";

export const sendMagicLink = async ({ email }: { email: string }) =>
  await AuthService.sendMagicLink({ email });

export const verifyMagicLink = async ({ hash }: { hash: string }) => {
  await AuthService.verifyMagicLink({ hash });
  await reloadSession();
};
