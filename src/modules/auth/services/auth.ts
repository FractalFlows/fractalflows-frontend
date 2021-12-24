import { ApolloQueryResult, gql } from "@apollo/client";

import client from "common/apollo-client";

export const AuthService = {
  async getNonce(): Promise<ApolloQueryResult<{ nonce: string }>> {
    return client.query({
      query: gql`
        query Nonce {
          nonce
        }
      `,
    });
  },

  async signin() {
    return true;
  },
};
