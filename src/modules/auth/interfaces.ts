import type { SiweMessage } from "siwe";

export interface User {
  email: string;
}

export interface Session {
  siweMessage: SiweMessage;
  username?: string;
  ens?: string;
  avatar?: string;
  email: User;
}

export enum SignInMethod {
  MAGICLINK = "MAGICLINK",
  ETHEREUM = "ETHEREUM",
}
