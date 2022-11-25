import { gql, useQuery } from "@apollo/client";
import { compact, concat, filter, findIndex } from "lodash-es";
import { ContractCtrl } from "@web3modal/core";

import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import KnowledgeBitContractABI from "../../../../artifacts/contracts/KnowledgeBit.sol/KnowledgeBit.json";
import { generateNFTId } from "common/utils/nfts";

export const getKnowledgeBit = async ({ id }: { id: string }) =>
  await ClaimsService.getKnowledgeBit({ id });

export const saveKnowledgeBitOnIPFS = async ({
  knowledgeBit,
}: {
  knowledgeBit: KnowledgeBitProps;
}) => {
  const saveKnowledgeBitOnIPFSResult =
    await ClaimsService.saveKnowledgeBitOnIPFS({
      knowledgeBit,
    });

  return saveKnowledgeBitOnIPFSResult;
};

export const mintKnowledgeBitNFT = async ({
  metadataURI,
  claimTokenId,
}: {
  metadataURI: string;
  claimTokenId: string;
}) => {
  const mintKnowledgeBitNFTTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_KNOWLEDGE_BIT_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: KnowledgeBitContractABI.abi,
    functionName: "mintToken",
    args: [
      metadataURI.replace(/^ipfs:\/\//, ""),
      generateNFTId(),
      claimTokenId,
    ],
  });

  return mintKnowledgeBitNFTTx;
};

export const updateKnowledgeBitNFTMetadata = async ({
  nftTokenId,
  metadataURI,
}: {
  nftTokenId: string;
  metadataURI: string;
}) => {
  const updateClaimNFTMetadataTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_KNOWLEDGE_BIT_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: KnowledgeBitContractABI.abi,
    functionName: "setTokenURI",
    args: [nftTokenId, metadataURI.replace(/^ipfs:\/\//, "")],
  });

  return updateClaimNFTMetadataTx;
};

export const createKnowledgeBit = async ({
  claimSlug,
  knowledgeBit,
}: {
  claimSlug: string;
  knowledgeBit: KnowledgeBitProps;
}) => {
  const createdKnowledgeBit = await ClaimsService.createKnowledgeBit({
    claimSlug,
    knowledgeBit,
  });
  const updatedKnowledgeBits = compact(
    concat(ClaimsCache.knowledgeBits(), createdKnowledgeBit)
  );
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return createdKnowledgeBit;
};

export const updateKnowledgeBit = async ({
  id,
  knowledgeBit,
}: {
  id: string;
  knowledgeBit: KnowledgeBitProps;
}) => {
  const updatedKnowledgeBit = await ClaimsService.updateKnowledgeBit({
    id,
    knowledgeBit,
  });
  const knowledgeBitIndex = findIndex(ClaimsCache.knowledgeBits(), { id });
  const updatedKnowledgeBits = [...ClaimsCache.knowledgeBits()];
  updatedKnowledgeBits.splice(knowledgeBitIndex, 1, updatedKnowledgeBit);
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return updatedKnowledgeBit;
};

export const deleteKnowledgeBit = async ({ id }: { id: string }) => {
  await ClaimsService.deleteKnowledgeBit({ id });
  const updatedKnowledgeBits = filter(
    ClaimsCache.knowledgeBits(),
    (knowledgeBit) => knowledgeBit.id !== id
  );
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return true;
};

const setKnowledgeBits = (knowledgeBits: KnowledgeBitProps[]) =>
  ClaimsCache.knowledgeBits(knowledgeBits);

export const useKnowledgeBits = () => {
  const {
    data: { knowledgeBits },
  } = useQuery(
    gql`
      query KnowledgeBit {
        knowledgeBits @client
      }
    `,
    { client: apolloClient }
  );

  return {
    getKnowledgeBit,
    saveKnowledgeBitOnIPFS,
    mintKnowledgeBitNFT,
    updateKnowledgeBitNFTMetadata,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
    knowledgeBits,
    setKnowledgeBits,
  };
};
