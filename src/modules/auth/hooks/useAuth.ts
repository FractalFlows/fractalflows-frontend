import { useQuery } from "@apollo/client";

import { apolloClient } from "common/apollo/client";
import { signin } from "./signin";
import { getSession } from "./session";
import { GET_SESSION_FROM_CACHE } from "../queries";

export const useAuth = () => {
  const {
    data: { session, isSignedIn },
  } = useQuery(GET_SESSION_FROM_CACHE, {
    client: apolloClient,
  });

  return {
    signin,
    getSession,
    session,
    isSignedIn,
  };
};
