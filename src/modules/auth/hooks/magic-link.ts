import { AuthService } from "../services/auth";

export const sendMagicLink = async ({ email }: { email: string }) =>
  await AuthService.sendMagicLink({ email });
