import { apolloClient } from "common/services/apollo/client";

import { UPDATE_EMAIL } from "../mutations";

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
};
