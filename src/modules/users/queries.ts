import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query GetProfile($username: String!) {
    profile(username: $username) {
      username
      avatar
      ethAddress
    }
  }
`;
