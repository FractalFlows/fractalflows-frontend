import type { SiweMessage } from "siwe";
import { gql } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { GET_NONCE, GET_SESSION } from "../queries";
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
    signature,
    ens,
    avatar,
  }: {
    siweMessage: SiweMessage;
    signature: string;
    ens?: string;
    avatar?: string;
  }): Promise<UserProps> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation SignInWithEthereum(
          $signInWithEthereumInput: SignInWithEthereumInput!
        ) {
          signInWithEthereum(
            signInWithEthereumInput: $signInWithEthereumInput
          ) {
            ethAddress
            email
          }
        }
      `,
      variables: {
        signInWithEthereumInput: {
          siweMessage,
          signature,
          ens,
          avatar,
        },
      },
    });

    return data.signInWithEthereum;
  },

  async signout(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation SignOut {
          signOut
        }
      `,
    });

    return data.signOut;
  },
};
