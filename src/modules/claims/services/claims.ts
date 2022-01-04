import { apolloClient } from "common/services/apollo/client";

import { CREATE_CLAIM, UPDATE_CLAIM } from "../mutations";
import { GET_CLAIM, GET_CLAIMS, GET_TRENDING_CLAIMS } from "../queries";
import type { ClaimProps } from "../interfaces";
import { PaginationProps } from "modules/interfaces";

export const ClaimsService = {
  async getClaim({ slug }: { slug: string }): Promise<ClaimProps> {
    const { data } = await apolloClient.query({
      query: GET_CLAIM,
      variables: {
        slug,
      },
    });

    return data.claim;
  },

  async getClaims({ limit, offset }: PaginationProps): Promise<ClaimProps[]> {
    const { data } = await apolloClient.query({
      query: GET_CLAIMS,
      variables: {
        limit,
        offset,
      },
    });

    return data.claims;
  },

  async getTrendingClaims({
    limit,
    offset,
  }: PaginationProps): Promise<ClaimProps[]> {
    const { data } = await apolloClient.query({
      query: GET_TRENDING_CLAIMS,
      variables: {
        limit,
        offset,
      },
    });

    return data.trendingClaims;
  },

  async createClaim({ claim }: { claim: ClaimProps }): Promise<ClaimProps> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_CLAIM,
      variables: {
        createClaimInput: claim,
      },
    });

    return data.createClaim;
  },

  async updateClaim({
    id,
    claim,
  }: {
    id: string;
    claim: ClaimProps;
  }): Promise<ClaimProps> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CLAIM,
      variables: {
        updateClaimInput: {
          id,
          ...claim,
        },
      },
    });

    return data.updateClaim;
  },
};
