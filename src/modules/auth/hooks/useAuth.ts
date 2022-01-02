import { useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { signInWithEthereum } from "./siwe";
import { sendMagicLink, verifyMagicLink } from "./magic-link";
import { signout } from "./signout";
import { getSession } from "./session";
import { GET_SESSION_FROM_CACHE } from "../queries";

export const useAuth = () => {
  const {
    data: { session, isSignedIn },
  } = useQuery(GET_SESSION_FROM_CACHE, {
    client: apolloClient,
  });

  return {
    signInWithEthereum,
    sendMagicLink,
    verifyMagicLink,
    signout,
    getSession,
    session,
    isSignedIn,
  };
};
