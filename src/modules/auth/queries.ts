import { gql } from "@apollo/client";

export const GET_NONCE = gql`
  query Nonce {
    nonce
  }
`;

export const GET_SESSION = gql`
  query Session {
    session {
      address
    }
  }
`;

export const GET_SESSION_FROM_CACHE = gql`
  query Session {
    session @client
    isSignedIn @client
  }
`;