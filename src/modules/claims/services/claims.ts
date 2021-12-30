import { apolloClient } from "common/services/apollo/client";

import { CREATE_CLAIM } from "../mutations";
import { LOAD_CLAIM } from "../queries";
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

  async loadClaim({ slug }: { slug: string }): Promise<Claim> {
    const { data } = await apolloClient.query({
      query: LOAD_CLAIM,
      variables: {
        slug,
      },
    });

    return data.claim;
  },
};
