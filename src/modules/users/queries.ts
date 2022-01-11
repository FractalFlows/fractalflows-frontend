import { gql } from "@apollo/client";
import { CORE_CLAIM_FIELDS } from "modules/claims/fragments";

export const GET_PROFILE = gql`
  ${CORE_CLAIM_FIELDS}

  query GetProfile($username: String!, $claimsRelation: UserClaimRelation!) {
    profile(username: $username) {
      username
      avatar
      ethAddress
    }

    userClaims(username: $username, relation: $claimsRelation) {
      ...CoreClaimFields
    }
  }
`;
