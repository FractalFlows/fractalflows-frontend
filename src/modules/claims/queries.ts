import { gql } from "@apollo/client";

import {
  CORE_ARGUMENT_FIELDS,
  CORE_CLAIM_FIELDS,
  KNOWLEDGE_BIT_FIELDS,
  OPINION_FIELDS,
  USER_OPINION_FIELDS,
} from "./fragments";

export const GET_CLAIM = gql`
  ${CORE_CLAIM_FIELDS}
  ${KNOWLEDGE_BIT_FIELDS}

  query GetClaim($slug: String!) {
    claim(slug: $slug) {
      ...CoreClaimFields
      tweetOwner
      sources {
        id
        url
      }
      attributions {
        id
        origin
        identifier
      }
      arguments {
        id
        summary
        side
        createdAt
        comments {
          id
        }
        opinions {
          id
          user {
            username
            avatar
          }
        }
      }
      followers {
        id
      }
      nftStatus
      nftTxId
      nftTokenId
      nftFractionalizationContractAddress
    }
    relatedClaims(slug: $slug) {
      ...CoreClaimFields
    }
    knowledgeBits(claimSlug: $slug) {
      ...KnowledgeBitFields
    }
  }
`;

export const GET_PARTIAL_CLAIM = gql`
  ${CORE_CLAIM_FIELDS}

  query GetPartialClaim($slug: String!) {
    claim(slug: $slug) {
      ...CoreClaimFields
      tweetOwner
      sources {
        id
        origin
        url
      }
      attributions {
        id
        origin
        identifier
      }
    }
  }
`;

export const GET_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetClaims($offset: Int!, $limit: Int!) {
    claims(offset: $offset, limit: $limit) {
      totalCount
      data {
        ...CoreClaimFields
      }
    }
  }
`;

export const GET_TRENDING_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetTrendingClaims($offset: Int!, $limit: Int!) {
    trendingClaims(offset: $offset, limit: $limit) {
      totalCount
      data {
        ...CoreClaimFields
      }
    }
  }
`;

export const GET_DISABLED_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetDisabledClaims($offset: Int!, $limit: Int!) {
    disabledClaims(offset: $offset, limit: $limit) {
      totalCount
      data {
        ...CoreClaimFields
        disabled
      }
    }
  }
`;

export const SEARCH_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query SearchClaims($term: String!, $offset: Int!, $limit: Int!) {
    searchClaims(term: $term, offset: $offset, limit: $limit) {
      totalCount
      data {
        ...CoreClaimFields
        relevance
      }
    }
  }
`;

export const GET_USER_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetUserClaims($username: String!) {
    userClaims(username: $username) {
      ...CoreClaimFields
    }
  }
`;

export const GET_CLAIMS_BY_TAG = gql`
  ${CORE_CLAIM_FIELDS}

  query GetClaimsByTag($tag: String!, $limit: Int!, $offset: Int!) {
    tag(slug: $tag) {
      label
    }

    claimsByTag(tag: $tag, limit: $limit, offset: $offset) {
      totalCount
      data {
        ...CoreClaimFields
      }
    }
  }
`;

export const GET_USER_CONTRIBUTED_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetUserContributedClaims($username: String!) {
    userContributedClaims(username: $username) {
      ...CoreClaimFields
    }
  }
`;

export const GET_USER_FOLLOWING_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetUserFollowngClaims($username: String!) {
    userFollowingClaims(username: $username) {
      ...CoreClaimFields
    }
  }
`;

export const GET_KNOWLEDGE_BIT = gql`
  ${KNOWLEDGE_BIT_FIELDS}

  query GetKnowledgeBit($id: String!) {
    knowledgeBit(id: $id) {
      ...KnowledgeBitFields
    }
  }
`;

export const GET_KNOWLEDGE_BITS = gql`
  ${KNOWLEDGE_BIT_FIELDS}

  query GetKnowledgeBits($claimSlug: String!) {
    knowledgeBits(claimSlug: $claimSlug) {
      ...KnowledgeBitFields
    }
  }
`;

export const GET_USER_KNOWLEDGE_BITS_VOTES = gql`
  query GetKnowledgeBitsVotes($claimSlug: String!) {
    userKnowledgeBitVotes(claimSlug: $claimSlug) {
      id
      type
      knowledgeBit {
        id
      }
    }
  }
`;

export const GET_ARGUMENT = gql`
  ${CORE_ARGUMENT_FIELDS}

  query GetArgument($id: String!) {
    argument(id: $id) {
      ...CoreArgumentFields
      evidences {
        id
        name
        url
      }
      comments {
        id
        content
        createdAt
        user {
          id
          username
          avatar
        }
        argument {
          id
        }
      }
    }
  }
`;

export const GET_ARGUMENTS = gql`
  ${CORE_ARGUMENT_FIELDS}

  query GetArguments($claimSlug: String!) {
    arguments(claimSlug: $claimSlug) {
      ...CoreArgumentFields
    }
  }
`;

export const GET_OPINION = gql`
  ${OPINION_FIELDS}

  query GetOpinion($id: String!) {
    opinion(id: $id) {
      ...OpinionFields
    }
  }
`;

export const GET_USER_OPINION = gql`
  ${USER_OPINION_FIELDS}

  query GetUserOpinion($claimSlug: String!) {
    userOpinion(claimSlug: $claimSlug) {
      ...UserOpinionFields
    }
  }
`;
