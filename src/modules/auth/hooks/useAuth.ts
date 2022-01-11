import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { apolloClient } from "common/services/apollo/client";
import { signInWithEthereum } from "./siwe";
import { sendMagicLink, verifyMagicLink } from "./magic-link";
import { signout } from "./signout";
import { getSession } from "./session";

export const useAuth = () => {
  const router = useRouter();
  const {
    data: { session, isSignedIn },
  } = useQuery(
    gql`
      query Session {
        session @client
        isSignedIn @client
      }
    `,
    {
      client: apolloClient,
    }
  );

  const requireSignIn =
    (handler: any, executeAnywaysHandler?: any) =>
    (...props: any) => {
      executeAnywaysHandler && executeAnywaysHandler(...props);

      if (isSignedIn) {
        handler(...props);
      } else {
        router.push("/signin");
      }
    };

  return {
    signInWithEthereum,
    sendMagicLink,
    verifyMagicLink,
    signout,
    requireSignIn,
    getSession,
    session,
    isSignedIn,
  };
};
