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
