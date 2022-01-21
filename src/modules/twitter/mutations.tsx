import { gql } from "@apollo/client";

export const REQUEST_OAUTH_URL = gql`
  mutation RequestTwitterOAuthUrl($callbackUrl: String!) {
    requestTwitterOAuthUrl(callbackUrl: $callbackUrl)
  }
`;

export const VALIDATE_OAUTH = gql`
  mutation ValidateTwitterOAuth($oauthToken: String!, $oauthVerifier: String!) {
    validateTwitterOAuth(oauthToken: $oauthToken, oauthVerifier: $oauthVerifier)
  }
`;
