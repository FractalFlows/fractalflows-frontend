import { apolloClient } from "common/services/apollo/client";

import { GET_API_KEY } from "../queries";
import {
  UPDATE_EMAIL,
  GENERATE_NEW_API_KEY,
  REMOVE_API_KEY,
} from "../mutations";

export const SettingsService = {
  async updateEmail({ email }: { email: string }): Promise<any> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_EMAIL,
      variables: {
        email,
      },
    });

    return data.saveEmail;
  },

  async getAPIKey(): Promise<string> {
    const { data } = await apolloClient.query({
      query: GET_API_KEY,
    });

    return data.apiKey;
  },

  async generateAPIKey(): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: GENERATE_NEW_API_KEY,
    });

    return data.generateAPIKey;
  },

  async removeAPIKey(): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_API_KEY,
    });

    return data.removeAPIKey;
  },
};
