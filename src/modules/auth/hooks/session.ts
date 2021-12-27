import type { SiweMessage } from "siwe";

import { AuthService } from "../services/auth";
import { AuthCache } from "../cache";
import { useQuery } from "@apollo/client";

export const getSession = async () => {
  const siweMessage = (await AuthService.getSession()) as SiweMessage;

  if (siweMessage) {
    AuthCache.sessionVar({ siweMessage });
    AuthCache.isSignedInVar(true);
  }
};

export const session = () => {
  useQuery();
};
