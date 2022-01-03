import { gql } from "@apollo/client";

export const CORE_CLAIM_FIELDS = gql`
  fragment CoreClaimFields on Claim {
    id
    title
    summary
    slug
  }
`;

export const GET_CLAIM = gql`
  ${CORE_CLAIM_FIELDS}

  query GetClaim($slug: String!) {
    claim(slug: $slug) {
      ...CoreClaimFields
      createdAt
      user {
        avatar
        username
      }
      sources {
        id
        origin
        url
      }
      tags {
        id
        label
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
