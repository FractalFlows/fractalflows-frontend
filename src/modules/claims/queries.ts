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
  query GetUserClaims($relation: UserClaimRelation!) {
    userClaims(relation: $relation) {
      id
      title
      summary
      slug
    }
  }
`;
