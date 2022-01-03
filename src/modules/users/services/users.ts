import { apolloClient } from "common/services/apollo/client";

import { GET_PROFILE } from "../queries";
import type { GetProfileProps, ProfileProps } from "../interfaces";
import type { ClaimProps } from "modules/claims/interfaces";

export const UsersService = {
  async getProfile({ username, claimsRelation }: GetProfileProps): Promise<{
    profile: ProfileProps;
    userClaims: ClaimProps[];
  }> {
    const { data } = await apolloClient.query({
      query: GET_PROFILE,
      variables: {
        username,
        claimsRelation,
      },
    });

    return data;
  },
};
