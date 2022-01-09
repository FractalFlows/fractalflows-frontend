import { gql } from "@apollo/client";

export const SEARCH_TAGS = gql`
  query SearchTags($term: String) {
    searchTags(term: $term) {
      id
      label
    }
  }
`;
