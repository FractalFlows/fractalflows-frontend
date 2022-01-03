import type { UserProps } from "modules/users/interfaces";
import type { SiweMessage } from "siwe";

export interface Session {
  siweMessage?: SiweMessage;
  user: UserProps;
}

export enum SignInMethod {
  MAGIC_LINK = "MAGIC_LINK",
  ETHEREUM = "ETHEREUM",
}
