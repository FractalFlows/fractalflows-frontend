import { gql, useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { signInWithEthereum } from "./siwe";
import { signout } from "./signout";
import { AppCache } from "modules/app/cache";
import { AuthCache } from "../cache";
import { AuthService } from "../services/auth";
import type { Session } from "../interfaces";

const getSession = async () => {
  AuthCache.isLoadingSession(true);

  try {
    const session = await AuthService.getSession();

    AuthCache.session(session);
    AuthCache.isSignedIn(true);
  } catch (e: any) {
    AuthCache.session({} as Session);
    AuthCache.isSignedIn(false);
  } finally {
    AuthCache.isLoadingSession(false);
  }
};

export const reloadSession = async () => {
  try {
    const session = await AuthService.getSession();
    AuthCache.session(session);
    AuthCache.isSignedIn(true);
  } catch (e: any) {
    AuthCache.session({} as Session);
    AuthCache.isSignedIn(false);
  }
};

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
    data: { session, isLoadingSession, isSignedIn },
  } = useQuery(
    gql`
      query Session {
        session @client
        isLoadingSession @client
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
    isLoadingSession,
    isSignedIn,
  };
};
