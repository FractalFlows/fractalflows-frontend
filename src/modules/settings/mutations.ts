import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      id
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      email
    }
  }
`;

export const CONNECT_ETHEREUM_WALLET = gql`
  mutation ConnectEthereumWallet($address: String!) {
    connectEthereumWallet(address: $address) {
      ethAddress
    }
  }
`;

export const CREATE_API_KEY = gql`
  mutation CreateAPIKey {
    createAPIKey {
      key
      secret
    }
  }
`;

export const REMOVE_API_KEY = gql`
  mutation RemoveAPIKey {
    removeAPIKey
  }
`;
