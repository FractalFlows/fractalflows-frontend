import type { SiweMessage } from "siwe";

import { apolloClient } from "common/services/apollo/client";
import { GET_NONCE, GET_SESSION } from "../queries";
import { SIGN_IN_WITH_ETHEREUM, SEND_MAGIC_LINK, SIGN_OUT } from "../mutations";
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

  async signInWithEthereum({
    siweMessage,
    ens,
  }: {
    siweMessage: SiweMessage;
    ens?: string;
  }): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_IN_WITH_ETHEREUM,
      variables: {
        signInInput: {
          siweMessage,
          ens,
        },
      },
    });

    return data.signInWithEthereum;
  },

  async sendMagicLink({ email }: { email: string }): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SEND_MAGIC_LINK,
      variables: {
        email,
      },
    });

    return data.sendMagicLink;
  },

  async signout(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_OUT,
    });

    return data.signOut;
  },
};
