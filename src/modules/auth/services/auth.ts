import type { SiweMessage } from "siwe";

import { apolloClient } from "common/apollo/client";
import { GET_NONCE, GET_SESSION } from "../queries";
import { SIGN_IN } from "../mutations";

export const AuthService = {
  async getNonce(): Promise<string> {
    return (
      await apolloClient.query({
        query: GET_NONCE,
      })
    )?.data?.nonce;
  },

  async getSession(): Promise<{ address: string }> {
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
};
