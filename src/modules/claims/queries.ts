import { gql } from "@apollo/client";

export const CORE_CLAIM_FIELDS = gql`
  fragment CoreClaimFields on Claim {
    id
    title
    summary
    slug
    createdAt
    user {
      avatar
      username
    }
    tags {
      id
      label
    }
  }
`;

export const GET_CLAIM = gql`
  ${CORE_CLAIM_FIELDS}

  query GetClaim($slug: String!) {
    claim(slug: $slug) {
      ...CoreClaimFields
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
    relatedClaims(slug: $slug) {
      ...CoreClaimFields
    }
  }
`;

export const GET_PARTIAL_CLAIM = gql`
  ${CORE_CLAIM_FIELDS}

  query GetPartialClaim($slug: String!) {
    claim(slug: $slug) {
      ...CoreClaimFields
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
      ...CoreClaimFields
    }
  }
`;

export const GET_TRENDING_CLAIMS = gql`
  ${CORE_CLAIM_FIELDS}

  query GetTrendingClaims($offset: Int!, $limit: Int!) {
    trendingClaims(offset: $offset, limit: $limit) {
      ...CoreClaimFields
    }
  }
`;

export const KNOWLEDGE_BIT_FIELDS = gql`
  fragment KnowledgeBitFields on KnowledgeBit {
    id
    name
    summary
    side
    type
    customType
    location
    customLocation
    url
    attributions {
      origin
      identifier
    }
    user {
      avatar
      username
    }
    upvotesCount
    downvotesCount
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
    userKnowledgeBitsVotes(claimSlug: $claimSlug) {
      type
      knowledgeBit {
        id
      }
    }
  }
`;
