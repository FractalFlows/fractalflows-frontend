import { gql, useQuery } from "@apollo/client";
import { SignatureType, SiweMessage } from "siwe";
import {
  AccountCtrl,
  EnsCtrl,
  ModalCtrl,
  NetworkCtrl,
  SignerCtrl,
} from "@web3modal/core";

import { apolloClient } from "common/services/apollo/client";
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
  } catch (e) {
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
  } catch (e) {
    AuthCache.session({} as Session);
    AuthCache.isSignedIn(false);
  }
};

const signInWithEthereum = async (callback: () => any) => {
  const handleSIWE = async (address: string) => {
    const nonce = await AuthService.getNonce();
    const network = NetworkCtrl.get();

    const siweMessage = new SiweMessage({
      domain: document.location.host,
      address,
      chainId: String(network?.chain?.id),
      uri: document.location.origin,
      version: "1",
      statement: "Fractal Flows sign in",
      type: SignatureType.PERSONAL_SIGNATURE,
      nonce,
    });

    const signature = await SignerCtrl.signMessage({
      message: siweMessage.signMessage(),
    });

    siweMessage.signature = signature;

    const ens = await EnsCtrl.fetchEnsName({ address });
    const avatar = await EnsCtrl.fetchEnsAvatar({ addressOrName: address });

    await AuthService.signInWithEthereum({
      siweMessage,
      ens,
      avatar,
    });
    await reloadSession();

    callback();
  };

  AccountCtrl.disconnect();
  ModalCtrl.open();

  AccountCtrl.watch(async (account) => {
    if (account.isConnected) {
      handleSIWE(account.address);
    }
  });
};

const signout = async () => {
  await AuthService.signout();

  AccountCtrl.disconnect();

  AuthCache.session({} as Session);
  AuthCache.isSignedIn(false);
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
    signout,
    requireSignIn,
    getSession,
    session,
    isLoadingSession,
    isSignedIn,
  };
};
