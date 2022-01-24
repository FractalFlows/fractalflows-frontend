import { apolloClient } from "common/services/apollo/client";

import { GET_PROFILE } from "../queries";
import type { GetProfileProps, ProfileProps } from "../interfaces";

export const UsersService = {
  async getProfile({ username }: GetProfileProps): Promise<ProfileProps> {
    const { data } = await apolloClient.query({
      query: GET_PROFILE,
      variables: {
        username,
      },
    });

    return data.profile;
  },
};
