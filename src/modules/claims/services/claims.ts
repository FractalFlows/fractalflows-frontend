import { apolloClient } from "common/services/apollo/client";

import {
  CREATE_CLAIM,
  UPDATE_CLAIM,
  DELETE_CLAIM,
  DISABLE_CLAIM,
  INVITE_FRIENDS,
  CREATE_KNOWLEDGE_BIT,
  UPDATE_KNOWLEDGE_BIT,
  DELETE_KNOWLEDGE_BIT,
  SAVE_KNOWLEDGE_BIT_VOTE,
  CREATE_ARGUMENT,
  SAVE_OPINION,
  ADD_FOLLOWER_TO_CLAIM,
  REMOVE_FOLLOWER_FROM_CLAIM,
  REQUEST_CLAIM_OWNERSHIP,
} from "../mutations";
import {
  GET_CLAIM,
  GET_PARTIAL_CLAIM,
  GET_CLAIMS,
  GET_TRENDING_CLAIMS,
  GET_KNOWLEDGE_BIT,
  GET_USER_KNOWLEDGE_BITS_VOTES,
  GET_ARGUMENTS,
  GET_OPINION,
  GET_USER_OPINION,
  GET_ARGUMENT,
  SEARCH_CLAIMS,
} from "../queries";
import type {
  ArgumentProps,
  ClaimProps,
  InviteFriendsProps,
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  KnowledgeBitVoteTypes,
  OpinionProps,
  PaginatedClaimsProps,
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

  async getClaims({
    limit,
    offset,
  }: PaginationProps): Promise<PaginatedClaimsProps> {
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
  }: PaginationProps): Promise<PaginatedClaimsProps> {
    const { data } = await apolloClient.query({
      query: GET_TRENDING_CLAIMS,
      variables: {
        limit,
        offset,
      },
    });

    return data.trendingClaims;
  },

  async searchClaims({
    term,
    limit,
    offset,
  }: { term: string } & PaginationProps): Promise<PaginatedClaimsProps> {
    const { data } = await apolloClient.query({
      query: SEARCH_CLAIMS,
      variables: {
        term,
        limit,
        offset,
      },
    });

    return data.searchClaims;
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

  async disableClaim({ id }: { id: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: DISABLE_CLAIM,
      variables: {
        id,
      },
    });

    return data.disableClaim;
  },

  async addFollowerToClaim({ id }: { id: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: ADD_FOLLOWER_TO_CLAIM,
      variables: {
        id,
      },
    });

    return data.addFollowerToClaim;
  },

  async removeFollowerFromClaim({ id }: { id: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_FOLLOWER_FROM_CLAIM,
      variables: {
        id,
      },
    });

    return data.removeFollowerFromClaim;
  },

  async requestOwnership({ id }: { id: string }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: REQUEST_CLAIM_OWNERSHIP,
      variables: {
        id,
      },
    });

    return data.requestClaimOwnership;
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

  async getUserKnowledgeBitVotes({
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

    return data.userKnowledgeBitVotes;
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
    argument: ArgumentProps;
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

  async getArguments({
    claimSlug,
  }: {
    claimSlug: string;
  }): Promise<KnowledgeBitProps[]> {
    const { data } = await apolloClient.query({
      query: GET_ARGUMENTS,
      variables: {
        claimSlug,
      },
    });

    return data.arguments;
  },

  async getArgument({ id }: { id: string }): Promise<ArgumentProps> {
    const { data } = await apolloClient.query({
      query: GET_ARGUMENT,
      variables: {
        id,
      },
    });

    return data.argument;
  },

  async getOpinion({ id }: { id: string }): Promise<OpinionProps> {
    const { data } = await apolloClient.query({
      query: GET_OPINION,
      variables: {
        id,
      },
    });

    return data.opinion;
  },

  async getUserOpinion({
    claimSlug,
  }: {
    claimSlug: string;
  }): Promise<OpinionProps> {
    const { data } = await apolloClient.query({
      query: GET_USER_OPINION,
      variables: {
        claimSlug,
      },
    });

    return data.userOpinion;
  },

  async saveOpinion({
    opinion,
  }: {
    opinion: OpinionProps;
  }): Promise<OpinionProps> {
    const { data } = await apolloClient.mutate({
      mutation: SAVE_OPINION,
      variables: {
        saveOpinionInput: opinion,
      },
    });

    return data.saveOpinion;
  },
};
