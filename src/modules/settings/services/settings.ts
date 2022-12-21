import { apolloClient } from "common/services/apollo/client";

import { GET_API_KEY } from "../queries";
import {
  UPDATE_PROFILE,
  UPDATE_EMAIL,
  CREATE_API_KEY,
  REMOVE_API_KEY,
  SEND_UPDATE_EMAIL_VERIFICATION_CODE,
} from "../mutations";
import type { APIKeyProps, UpdateProfileProps } from "../interfaces";
import type { UserProps } from "modules/users/interfaces";

export const SettingsService = {
  async updateProfile(profile: UpdateProfileProps): Promise<UserProps> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PROFILE,
      variables: {
        updateProfileInput: profile,
      },
    });

    return data.updateProfile;
  },

  async updateEmail({
    verificationCode,
  }: {
    verificationCode: string;
  }): Promise<any> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_EMAIL,
      variables: {
        verificationCode,
      },
    });

    return data.updateEmail;
  },

  async sendUpdateEmailVerificationCode({
    email,
  }: {
    email: string;
  }): Promise<any> {
    const { data } = await apolloClient.mutate({
      mutation: SEND_UPDATE_EMAIL_VERIFICATION_CODE,
      variables: {
        email,
      },
    });

    return data.sendUpdateEmailVerificationCode;
  },

  async getAPIKey(): Promise<string> {
    const { data } = await apolloClient.query({
      query: GET_API_KEY,
      fetchPolicy: "no-cache",
    });

    return data.apiKey;
  },

  async createAPIKey(): Promise<APIKeyProps> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_API_KEY,
    });

    return data.createAPIKey;
  },

  async removeAPIKey(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_API_KEY,
    });

    return data.removeAPIKey;
  },
};
