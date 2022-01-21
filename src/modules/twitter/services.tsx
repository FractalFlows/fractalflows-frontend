import { apolloClient } from "common/services/apollo/client";

import { REQUEST_OAUTH_URL, VALIDATE_OAUTH } from "./mutations";

export const TwitterService = {
  async requestOAuthUrl({
    callbackUrl,
  }: {
    callbackUrl: string;
  }): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: REQUEST_OAUTH_URL,
      variables: {
        callbackUrl,
      },
    });

    return data.requestTwitterOAuthUrl;
  },

  async validateOAuth({
    oauthToken,
    oauthVerifier,
  }: {
    oauthToken: string;
    oauthVerifier: string;
  }): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: VALIDATE_OAUTH,
      variables: {
        oauthToken,
        oauthVerifier,
      },
    });

    return data.validateTwitterOAuth;
  },
};
