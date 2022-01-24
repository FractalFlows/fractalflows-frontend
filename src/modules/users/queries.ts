import { gql } from "@apollo/client";

import { CORE_CLAIM_FIELDS } from "modules/claims/fragments";

export const GET_PROFILE = gql`
  ${CORE_CLAIM_FIELDS}

  query GetProfile($username: String!) {
    profile(username: $username) {
      username
      avatar
      ethAddress
    }

    userClaims(username: $username) {
      ...CoreClaimFields
    }
  }
`;
