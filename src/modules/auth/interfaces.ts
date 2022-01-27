import type { UserProps } from "modules/users/interfaces";
import type { SiweMessage } from "siwe";

export interface Session {
  siweMessage?: SiweMessage;
  user: UserProps;
}

export enum SignInMethod {
  EMAIL = "EMAIL",
  ETHEREUM = "ETHEREUM",
}

export enum UserRole {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
  VALIDATOR = "VALIDATOR",
}
