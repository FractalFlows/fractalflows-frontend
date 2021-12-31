import { gql } from "@apollo/client";

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      email
    }
  }
`;
