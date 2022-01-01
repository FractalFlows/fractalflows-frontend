import { gql } from "@apollo/client";

export const SIGN_IN_WITH_ETHEREUM = gql`
  mutation SignInWithEthereum(
    $signInWithEthereumInput: SignInWithEthereumInput!
  ) {
    signInWithEthereum(signInWithEthereumInput: $signInWithEthereumInput)
  }
`;

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    sendMagicLink(email: $email)
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;
