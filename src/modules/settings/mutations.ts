import { gql } from "@apollo/client";

export const CREATE_CLAIM = gql`
  mutation CreateClaim($createClaimInput: CreateClaimInput!) {
    createClaim(createClaimInput: $createClaimInput) {
      id
      slug
    }
  }
`;
