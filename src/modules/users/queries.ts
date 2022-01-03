import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query GetProfile($username: String!, $claimsRelation: UserClaimRelation!) {
    profile(username: $username) {
      username
      avatar
      ethAddress
    }

    userClaims(username: $username, relation: $claimsRelation) {
      id
      title
      summary
      slug
    }
  }
`;
