import { apolloClient } from "common/services/apollo/client";

import { CREATE_CLAIM } from "../mutations";
import { Claim } from "../interfaces";

export const ClaimsService = {
  async createClaim({ claim }: { claim: Claim }): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_CLAIM,
      variables: {
        createClaimInput: claim,
      },
    });

    return data.createClaim;
  },
};
