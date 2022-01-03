import { apolloClient } from "common/services/apollo/client";

import { GET_API_KEY } from "../queries";
import {
  UPDATE_PROFILE,
  UPDATE_EMAIL,
  CONNECT_ETHEREUM_WALLET,
  CREATE_API_KEY,
  REMOVE_API_KEY,
} from "../mutations";
import { APIKeyProps, UpdateProfileProps } from "../interfaces";
import { User } from "modules/users/interfaces";

export const SettingsService = {
  async updateProfile(profile: UpdateProfileProps): Promise<User> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PROFILE,
      variables: {
        updateProfileInput: profile,
      },
    });

    return data.updateProfile;
  },

  async updateEmail({ email }: { email: string }): Promise<any> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_EMAIL,
      variables: {
        email,
      },
    });

    return data.saveEmail;
  },

  async connectEthereumWallet({ address }: any): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: CONNECT_ETHEREUM_WALLET,
      variables: {
        address,
      },
    });

    return data.removeAPIKey;
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
