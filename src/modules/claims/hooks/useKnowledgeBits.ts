import { gql, useQuery } from "@apollo/client";
import { compact, concat, filter, findIndex, get } from "lodash-es";
import { BigNumber } from "ethers";

import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import { AccountCtrl, ContractCtrl } from "@web3modal/core";
import KnowledgeBitContractABI from "../../../../artifacts/contracts/KnowledgeBit.sol/KnowledgeBit.json";

export const getKnowledgeBit = async ({ id }: { id: string }) =>
  await ClaimsService.getKnowledgeBit({ id });

export const saveKnowledgeBitOnIPFS = async ({
  knowledgeBit,
}: {
  knowledgeBit: KnowledgeBitProps;
}) => {
  const savedKnowledgeBitMetadataURI =
    await ClaimsService.saveKnowledgeBitOnIPFS({
      knowledgeBit,
    });

  return savedKnowledgeBitMetadataURI;
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
    args: [metadataURI.replace(/^ipfs:\/\//, ""), claimTokenId || "0"],
  });

  const mintKnowledgeBitNFTTxReceipt = await mintKnowledgeBitNFTTx.wait();

  console.log(mintKnowledgeBitNFTTxReceipt);
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
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
    knowledgeBits,
    setKnowledgeBits,
  };
};
