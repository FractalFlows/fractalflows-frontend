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

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    sendMagicLink(email: $email)
  }
`;

export const VERIFY_MAGIC_LINK = gql`
  mutation VerifyMagicLink($hash: String!) {
    verifyMagicLink(hash: $hash) {
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
