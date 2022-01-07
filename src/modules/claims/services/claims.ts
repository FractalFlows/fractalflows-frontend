import { apolloClient } from "common/services/apollo/client";

import {
  CREATE_CLAIM,
  UPDATE_CLAIM,
  DELETE_CLAIM,
  INVITE_FRIENDS,
  CREATE_KNOWLEDGE_BIT,
  UPDATE_KNOWLEDGE_BIT,
  DELETE_KNOWLEDGE_BIT,
  SAVE_KNOWLEDGE_BIT_VOTE,
  CREATE_ARGUMENT,
} from "../mutations";
import {
  GET_CLAIM,
  GET_PARTIAL_CLAIM,
  GET_CLAIMS,
  GET_TRENDING_CLAIMS,
  GET_KNOWLEDGE_BIT,
  GET_KNOWLEDGE_BITS,
  GET_USER_KNOWLEDGE_BITS_VOTES,
} from "../queries";
import type {
  ArgumentProps,
  ClaimProps,
  CreateArgumentProps,
  InviteFriendsProps,
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  KnowledgeBitVoteTypes,
} from "../interfaces";
import type { PaginationProps } from "modules/interfaces";

export const ClaimsService = {
  async getClaim({
    slug,
  }: {
    slug: string;
  }): Promise<{ claim: ClaimProps; relatedClaims: ClaimProps[] }> {
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

  async getKnowledgeBit({ id }: { id: string }): Promise<KnowledgeBitProps> {
    const { data } = await apolloClient.query({
      query: GET_KNOWLEDGE_BIT,
      variables: {
        id,
      },
    });

    return data.knowledgeBit;
  },

  async getKnowledgeBits({
    claimSlug,
  }: {
    claimSlug: string;
  }): Promise<KnowledgeBitProps[]> {
    const { data } = await apolloClient.query({
      query: GET_KNOWLEDGE_BITS,
      variables: {
        claimSlug,
      },
    });

    return data.knowledgeBits;
  },

  async getUserKnowledgeBitsVotes({
    claimSlug,
  }: {
    claimSlug: string;
  }): Promise<KnowledgeBitVoteProps[]> {
    const { data } = await apolloClient.query({
      query: GET_USER_KNOWLEDGE_BITS_VOTES,
      variables: {
        claimSlug,
      },
    });

    return data.userKnowledgeBitsVotes;
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
        claimSlug,
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
          ...knowledgeBit,
          id,
        },
      },
    });

    return data.updateKnowledgeBit;
  },

  async deleteKnowledgeBit({ id }: { id: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_KNOWLEDGE_BIT,
      variables: {
        id,
      },
    });

    return data.deleteKnowledgeBit;
  },

  async saveKnowledgeBitVote({
    knowledgeBitId,
    type,
  }: {
    knowledgeBitId: string;
    type: KnowledgeBitVoteTypes;
  }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: SAVE_KNOWLEDGE_BIT_VOTE,
      variables: {
        knowledgeBitId,
        type,
      },
    });

    return data.saveKnowledgeBitVote;
  },

  async createArgument({
    claimSlug,
    argument,
  }: {
    claimSlug: string;
    argument: CreateArgumentProps;
  }): Promise<ArgumentProps> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_ARGUMENT,
      variables: {
        claimSlug,
        createArgumentInput: argument,
      },
    });

    return data.createArgument;
  },
};
