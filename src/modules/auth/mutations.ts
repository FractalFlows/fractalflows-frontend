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

export const SEND_SIGN_IN_CODE = gql`
  mutation SendSignInCode($email: String!) {
    sendSignInCode(email: $email)
  }
`;

export const VERIFY_SIGN_IN_CODE = gql`
  mutation VerifySignInCode($signInCode: String!) {
    verifySignInCode(signInCode: $signInCode) {
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
