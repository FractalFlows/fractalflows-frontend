import type { SiweMessage } from "siwe";

import { apolloClient } from "common/services/apollo/client";
import { GET_NONCE, GET_SESSION } from "../queries";
import {
  SIGN_IN_WITH_ETHEREUM,
  SIGN_OUT,
} from "../mutations";
import type { Session } from "../interfaces";
import type { UserProps } from "../../users/interfaces";

export const AuthService = {
  async getNonce(): Promise<string> {
    return (
      await apolloClient.query({
        query: GET_NONCE,
        fetchPolicy: "no-cache",
      })
    )?.data?.nonce;
  },

  async getSession(): Promise<Session> {
    return (
      await apolloClient.query({
        query: GET_SESSION,
        fetchPolicy: "no-cache",
      })
    )?.data?.session;
  },

  async signInWithEthereum({
    siweMessage,
    ens,
    avatar,
  }: {
    siweMessage: SiweMessage;
    ens?: string;
    avatar?: string;
  }): Promise<UserProps> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_IN_WITH_ETHEREUM,
      variables: {
        signInWithEthereumInput: {
          siweMessage,
          ens,
          avatar,
        },
      },
    });

    return data.signInWithEthereum;
  },

  async signout(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_OUT,
    });

    return data.signOut;
  },
};
