import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      id
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($verificationCode: String!) {
    updateEmail(verificationCode: $verificationCode)
  }
`;

export const SEND_UPDATE_EMAIL_VERIFICATION_CODE = gql`
  mutation SendUpdateEmailVerificationCode($email: String!) {
    sendUpdateEmailVerificationCode(email: $email)
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
