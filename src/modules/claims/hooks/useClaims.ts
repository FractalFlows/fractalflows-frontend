import { gql, useQuery } from "@apollo/client";
import { get } from "lodash-es";
import { utils as ethersUtils } from "ethers";
import { ContractCtrl } from "@web3modal/core";

import { getClaim, getPartialClaim, getClaims, getTrendingClaims } from "./get";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import { ClaimsService } from "../services/claims";
import { PaginationProps } from "modules/interfaces";
import { ClaimsCache } from "../cache";
import { ClaimProps } from "../interfaces";
import { apolloClient } from "common/services/apollo/client";
import { AuthCache } from "modules/auth/cache";
import ClaimContractABI from "../../../../artifacts/contracts/Claim.sol/Claim.json";
import { generateNFTId } from "common/utils/nfts";

const saveClaimOnIPFS = async ({ claim }: { claim: Partial<ClaimProps> }) => {
  return await ClaimsService.saveClaimOnIPFS({ claim });
};

export const mintClaimNFT = async ({
  metadataURI,
}: {
  metadataURI: string;
}) => {
  const mintClaimNFTTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: ClaimContractABI.abi,
    functionName: "mintToken",
    args: [
      metadataURI.replace(/^ipfs:\/\//, ""),
      generateNFTId(),
      ethersUtils.parseEther("100.0"),
    ],
  });

  return mintClaimNFTTx;
};

export const updateClaimNFTMetadata = async ({
  nftTokenId,
  metadataURI,
}: {
  nftTokenId: string;
  metadataURI: string;
}) => {
  const updateClaimNFTMetadataTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: ClaimContractABI.abi,
    functionName: "setTokenURI",
    args: [nftTokenId, metadataURI.replace(/^ipfs:\/\//, "")],
  });

  return updateClaimNFTMetadataTx;
};

export const getClaimNFTFractionalizationContractOf = async ({
  nftTokenId,
}: {
  nftTokenId: string;
}): Promise<string> => {
  const fractionalizationContract = await ContractCtrl.read({
    address: process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: ClaimContractABI.abi,
    functionName: "fractionalizationContractOf",
    args: [nftTokenId],
  });

  return fractionalizationContract;
};

export const createClaim = async ({ claim }: { claim: ClaimProps }) =>
  await ClaimsService.createClaim({ claim });

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
    saveClaimOnIPFS,
    mintClaimNFT,
    updateClaimNFTMetadata,
    getClaimNFTFractionalizationContractOf,
    updateClaim,
    deleteClaim,
    disableClaim,
    reenableClaim,
    addFollowerToClaim,
    removeFollowerFromClaim,
    inviteFriends,
    requestClaimOwnership,
  };
};
