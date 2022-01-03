import { apolloClient } from "common/services/apollo/client";

import { CREATE_CLAIM } from "../mutations";
import { GET_CLAIM, GET_USER_CLAIMS } from "../queries";
import { Claim, GetUserClaimsProps, UserClaimRelation } from "../interfaces";
import { Profile } from "modules/user/interfaces";

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

  async getUserClaims({
    username,
    relation,
  }: GetUserClaimsProps): Promise<{ profile: Profile; userClaims: Claim[] }> {
    const { data } = await apolloClient.query({
      query: GET_USER_CLAIMS,
      variables: {
        username,
        relation,
      },
    });

    return data;
  },
};
