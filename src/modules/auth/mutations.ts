import { gql } from "@apollo/client";

export const SIGN_IN_WITH_ETHEREUM = gql`
  mutation SignInWithEthereum(
    $signInWithEthereumInput: SignInWithEthereumInput!
  ) {
    signInWithEthereum(signInWithEthereumInput: $signInWithEthereumInput) {
      ethAddress
      email
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;
