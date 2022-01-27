import { gql, useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { signInWithEthereum } from "./siwe";
import { signout } from "./signout";
import { getSession, reloadSession } from "./session";
import { AppCache } from "modules/app/cache";
import { AuthCache } from "../cache";
import { AuthService } from "../services/auth";

const sendSignInCode = async ({ email }: { email: string }) =>
  await AuthService.sendSignInCode({ email });

const verifySignInCode = async ({ signInCode }: { signInCode: string }) => {
  await AuthService.verifySignInCode({ signInCode });
  await reloadSession();
};

const requireSignIn =
  (handler: any, executeAnywaysHandler?: any) =>
  (...props: any) => {
    executeAnywaysHandler && executeAnywaysHandler(...props);

    if (AuthCache.isSignedIn()) {
      handler(...props);
    } else {
      AppCache.isSignInDialogOpen(true);
      AppCache.signInCallback = () => handler(...props);
    }
  };

export const useAuth = () => {
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

  return {
    signInWithEthereum,
    sendSignInCode,
    verifySignInCode,
    signout,
    requireSignIn,
    getSession,
    session,
    isSignedIn,
  };
};
