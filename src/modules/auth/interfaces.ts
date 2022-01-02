import type { SiweMessage } from "siwe";

export interface User {
  email: string;
  ethAddress: string;
}

export interface Session {
  siweMessage?: SiweMessage;
  username?: string;
  ens?: string;
  avatar?: string;
  user: User;
}

export enum SignInMethod {
  MAGIC_LINK = "MAGIC_LINK",
  ETHEREUM = "ETHEREUM",
}
