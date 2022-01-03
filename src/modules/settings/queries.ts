import { gql } from "@apollo/client";

export const GET_API_KEY = gql`
  query GetAPIKey {
    apiKey
  }
`;
