import { gql, useQuery } from "@apollo/client";

import { getClaim, getPartialClaim, getClaims, getTrendingClaims } from "./get";
import { createClaim } from "./create";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import {
  getKnowledgeBit,
  createKnowledgeBit,
  updateKnowledgeBit,
  deleteKnowledgeBit,
} from "./knowledgeBit";
import { ClaimsService } from "../services/claims";
import { PaginationProps } from "modules/interfaces";
import { ClaimsCache } from "../cache";
import { ClaimProps } from "../interfaces";
import { apolloClient } from "common/services/apollo/client";
import { AuthCache } from "modules/auth/cache";

const searchClaims = async ({
  term,
  limit,
  offset,
}: { term: string } & PaginationProps) => {
  return await ClaimsService.searchClaims({ term, limit, offset });
};

const getUserClaims = async ({ username }: { username: string }) => {
  return await ClaimsService.getUserClaims({ username });
};

const getUserContributedClaims = async ({ username }: { username: string }) => {
  return await ClaimsService.getUserContributedClaims({ username });
};

const getUserFollowingClaims = async ({ username }: { username: string }) => {
  return await ClaimsService.getUserFollowingClaims({ username });
};

const disableClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.disableClaim({ id });
};

const addFollowerToClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.addFollowerToClaim({ id });
};

const removeFollowerFromClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.removeFollowerFromClaim({ id });
};

const requestClaimOwnership = async ({ id }: { id: string }) => {
  const result = await ClaimsService.requestOwnership({ id });
  ClaimsCache.claim({
    ...ClaimsCache.claim(),
    user: AuthCache.session().user,
  });
  return result;
};

const setClaim = (claim: ClaimProps) => ClaimsCache.claim(claim);

export const useClaims = () => {
  const {
    data: { claim },
  } = useQuery(
    gql`
      query Claim {
        claim @client
      }
    `,
    { client: apolloClient }
  );

  return {
    claim,
    getClaim,
    setClaim,
    getPartialClaim,
    getClaims,
    getTrendingClaims,
    searchClaims,
    getUserClaims,
    getUserContributedClaims,
    getUserFollowingClaims,
    createClaim,
    updateClaim,
    deleteClaim,
    disableClaim,
    addFollowerToClaim,
    removeFollowerFromClaim,
    inviteFriends,
    requestClaimOwnership,
    getKnowledgeBit,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
  };
};
