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
      knowledgeBits {
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
