import { gql } from "@apollo/client";

export const GET_NONCE = gql`
  query Nonce {
    nonce
  }
`;

export const GET_SESSION = gql`
  query Session {
    session {
      siweMessage {
        address
        chainId
      }
      user {
        id
        ethAddress
        email
        username
        usernameSource
        avatar
        avatarSource
        role
      }
    }
  }
`;
