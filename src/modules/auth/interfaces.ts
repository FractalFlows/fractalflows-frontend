import type { SiweMessage } from "siwe";

export interface Session {
  siweMessage: SiweMessage;
  ens?: string;
  avatar?: string;
}
