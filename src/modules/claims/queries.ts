import { gql } from "@apollo/client";

export const GET_CLAIM = gql`
  query GetClaim($slug: String!) {
    claim(slug: $slug) {
      id
      title
      summary
      slug
    }
  }
`;

export const GET_USER_CLAIMS = gql`
  query GetUserClaims($username: String!, $relation: UserClaimRelation!) {
    profile(username: $username) {
      username
      avatar
      ethAddress
    }

    userClaims(username: $username, relation: $relation) {
      id
      title
      summary
      slug
    }
  }
`;
