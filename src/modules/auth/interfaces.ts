import type { SiweMessage } from "siwe";

export interface Session {
  siweMessage: SiweMessage;
  username?: string;
  ens?: string;
  avatar?: string;
}
