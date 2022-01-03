import { apolloClient } from "common/services/apollo/client";

import { CREATE_CLAIM } from "../mutations";
import { GET_CLAIM } from "../queries";
import { Claim } from "../interfaces";

export const ClaimsService = {
  async createClaim({ claim }: { claim: Claim }): Promise<Claim> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_CLAIM,
      variables: {
        createClaimInput: claim,
      },
    });

    return data.createClaim;
  },

  async getClaim({ slug }: { slug: string }): Promise<Claim> {
    const { data } = await apolloClient.query({
      query: GET_CLAIM,
      variables: {
        slug,
      },
    });

    return data.claim;
  },
};
