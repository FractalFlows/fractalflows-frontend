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
import { ClaimNFTStatuses, ClaimProps } from "../interfaces";
import { apolloClient } from "common/services/apollo/client";
import { AuthCache } from "modules/auth/cache";
import { get } from "lodash-es";

const saveClaimMetadataOnIPFS = async ({ id }: { id: string }) => {
  return await ClaimsService.saveClaimMetadataOnIPFS({ id });
};

const saveClaimTxId = async ({ id, txId }: { id: string; txId: string }) => {
  await ClaimsService.saveClaimTxId({ id, txId });
  ClaimsCache.claim({
    ...ClaimsCache.claim(),
    nftStatus: ClaimNFTStatuses.MINTING,
    nftTxId: txId,
  });
};

const searchClaims = async ({
  term,
  limit,
  offset,
}: { term: string } & PaginationProps) => {
  return await ClaimsService.searchClaims({ term, limit, offset });
};

const setClaimNFTAsMinted = ({
  tokenId,
  fractionalizationContractAddress,
}: {
  tokenId: string;
  fractionalizationContractAddress: string;
}) => {
  ClaimsCache.claim({
    ...ClaimsCache.claim(),
    nftStatus: ClaimNFTStatuses.MINTED,
    nftFractionalizationContractAddress: fractionalizationContractAddress,
    nftTokenId: tokenId,
  });
};

const getUserClaims = async ({ username }: { username: string }) => {
  return await ClaimsService.getUserClaims({ username });
};

const getClaimsByTag = async ({
  tag,
  limit,
  offset,
}: { tag: string } & PaginationProps) => {
  return await ClaimsService.getClaimsByTag({ tag, limit, offset });
};

const getDisabledClaims = async ({ limit, offset }: PaginationProps) => {
  const disabledClaims = await ClaimsService.getDisabledClaims({
    limit,
    offset,
  });
  ClaimsCache.disabledClaims(disabledClaims.data);
  ClaimsCache.disabledClaimsTotalCount(disabledClaims.totalCount);
  return disabledClaims;
};

const getMoreDisabledClaims = async ({ limit, offset }: PaginationProps) => {
  const disabledClaims = await ClaimsService.getDisabledClaims({
    limit,
    offset,
  });
  ClaimsCache.disabledClaims([
    ...ClaimsCache.disabledClaims(),
    ...disabledClaims.data,
  ]);
  ClaimsCache.disabledClaimsTotalCount(disabledClaims.totalCount);
  return disabledClaims;
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

const reenableClaim = async ({ id }: { id: string }) => {
  const result = await ClaimsService.reenableClaim({ id });
  ClaimsCache.disabledClaims(
    ClaimsCache.disabledClaims().filter(
      (disabledClaim) => disabledClaim.id !== id
    )
  );
  ClaimsCache.disabledClaimsTotalCount(
    ClaimsCache.disabledClaimsTotalCount() - 1
  );
  return result;
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
  const { data } = useQuery(
    gql`
      query Claim {
        claim @client
        disabledClaims @client
        disabledClaimsTotalCount @client
      }
    `,
    { client: apolloClient }
  );

  return {
    claim: get(data, "claim"),
    disabledClaims: get(data, "disabledClaims"),
    disabledClaimsTotalCount: get(data, "disabledClaimsTotalCount"),
    getClaim,
    setClaim,
    getPartialClaim,
    getClaims,
    getTrendingClaims,
    getDisabledClaims,
    getMoreDisabledClaims,
    searchClaims,
    getUserClaims,
    getClaimsByTag,
    getUserContributedClaims,
    getUserFollowingClaims,
    createClaim,
    saveClaimMetadataOnIPFS,
    saveClaimTxId,
    setClaimNFTAsMinted,
    updateClaim,
    deleteClaim,
    disableClaim,
    reenableClaim,
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
