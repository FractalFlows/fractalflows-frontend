import { apolloClient } from "common/services/apollo/client";

import {
  CREATE_CLAIM,
  UPDATE_CLAIM,
  DELETE_CLAIM,
  INVITE_FRIENDS,
  CREATE_KNOWLEDGE_BIT,
  UPDATE_KNOWLEDGE_BIT,
} from "../mutations";
import {
  GET_CLAIM,
  GET_PARTIAL_CLAIM,
  GET_CLAIMS,
  GET_TRENDING_CLAIMS,
} from "../queries";
import type {
  ClaimProps,
  InviteFriendsProps,
  KnowledgeBitProps,
} from "../interfaces";
import type { PaginationProps } from "modules/interfaces";

export const ClaimsService = {
  async getClaim({ slug }: { slug: string }): Promise<ClaimProps> {
    const { data } = await apolloClient.query({
      query: GET_CLAIM,
      variables: {
        slug,
      },
    });

    return data;
  },

  async getPartialClaim({ slug }: { slug: string }): Promise<ClaimProps> {
    const { data } = await apolloClient.query({
      query: GET_PARTIAL_CLAIM,
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

  async deleteClaim({ id }: { id: string }): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_CLAIM,
      variables: {
        id,
      },
    });

    return data.deleteClaim;
  },

  async inviteFriends({
    slug,
    emails,
    message,
  }: InviteFriendsProps): Promise<Boolean> {
    const { data } = await apolloClient.mutate({
      mutation: INVITE_FRIENDS,
      variables: {
        inviteFriendsInput: {
          slug,
          emails,
          message,
        },
      },
    });

    return data.inviteFriends;
  },

  async createKnowledgeBit({
    claimSlug,
    knowledgeBit,
  }: {
    claimSlug: string;
    knowledgeBit: KnowledgeBitProps;
  }): Promise<KnowledgeBitProps> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_KNOWLEDGE_BIT,
      variables: {
        claimSlug: claimSlug,
        createKnowledgeBitInput: knowledgeBit,
      },
    });

    return data.createKnowledgeBit;
  },

  async updateKnowledgeBit({
    id,
    knowledgeBit,
  }: {
    id: string;
    knowledgeBit: KnowledgeBitProps;
  }): Promise<KnowledgeBitProps> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_KNOWLEDGE_BIT,
      variables: {
        updateKnowledgeBitInput: {
          id,
          ...knowledgeBit,
        },
      },
    });

    return data.updateKnowledgeBit;
  },
};
