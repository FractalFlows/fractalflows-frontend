import { gql } from "@apollo/client";

export const LOAD_CLAIM = gql`
  query LoadClaim($slug: String!) {
    claim(slug: $slug) {
      id
      title
      summary
      slug
    }
  }
`;
