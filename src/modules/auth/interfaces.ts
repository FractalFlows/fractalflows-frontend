import type { User } from "modules/user/interfaces";
import type { SiweMessage } from "siwe";

export interface Session {
  siweMessage?: SiweMessage;
  user: User;
}

export enum SignInMethod {
  MAGIC_LINK = "MAGIC_LINK",
  ETHEREUM = "ETHEREUM",
}
