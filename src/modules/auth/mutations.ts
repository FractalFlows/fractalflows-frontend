import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput)
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;
