import { gql } from "@apollo/client";

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      email
    }
  }
`;

export const GENERATE_NEW_API_KEY = gql`
  mutation GenerateAPIKey {
    generateAPIKey
  }
`;

export const REMOVE_API_KEY = gql`
  mutation RemoveAPIKey {
    removeAPIKey
  }
`;
