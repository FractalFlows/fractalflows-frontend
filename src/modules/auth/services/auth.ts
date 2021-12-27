import type { SiweMessage } from "siwe";

import { apolloClient } from "common/services/apollo/client";
import { GET_NONCE, GET_SESSION } from "../queries";
import { SIGN_IN, SIGN_OUT } from "../mutations";
import { Session } from "../interfaces";

export const AuthService = {
  async getNonce(): Promise<string> {
    return (
      await apolloClient.query({
        query: GET_NONCE,
        fetchPolicy: "network-only",
      })
    )?.data?.nonce;
  },

  async getSession(): Promise<Session> {
    return (
      await apolloClient.query({
        query: GET_SESSION,
        fetchPolicy: "network-only",
      })
    )?.data?.session;
  },

  async signin({
    siweMessage,
    ens,
  }: {
    siweMessage: SiweMessage;
    ens?: string;
  }): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: {
        signInInput: {
          siweMessage,
          ens,
        },
      },
    });

    return data.signIn;
  },

  async signout(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_OUT,
    });

    return data.signOut;
  },
};
