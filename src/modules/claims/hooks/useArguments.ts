import { compact, concat } from "lodash-es";
import { gql, useQuery } from "@apollo/client";

import { ClaimsService } from "../services/claims";
import type { ArgumentProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import ArgumentContractABI from "../../../../artifacts/contracts/Argument.sol/Argument.json";
import { ContractCtrl } from "@web3modal/core";
import { generateNFTId } from "common/utils/nfts";

export const saveArgumentOnIPFS = async ({
  argument,
}: {
  argument: Partial<ArgumentProps>;
}) => {
  const saveArgumentOnIPFSResult = await ClaimsService.saveArgumentOnIPFS({
    argument,
  });

  return saveArgumentOnIPFSResult;
};

export const mintArgumentNFT = async ({
  metadataURI,
  knowledgeBitIds,
  claimTokenId,
}: {
  metadataURI: string;
  knowledgeBitIds?: string[];
  claimTokenId: string;
}) => {
  const mintArgumentNFTTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_ARGUMENT_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: ArgumentContractABI.abi,
    functionName: "mintToken",
    args: [
      metadataURI.replace(/^ipfs:\/\//, ""),
      generateNFTId(),
      knowledgeBitIds,
      claimTokenId,
    ],
  });

  return mintArgumentNFTTx;
};

export const updateArgumentNFTMetadata = async ({
  nftTokenId,
  metadataURI,
}: {
  nftTokenId: string;
  metadataURI: string;
}) => {
  const updateClaimNFTMetadataTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_KNOWLEDGE_BIT_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: ArgumentContractABI.abi,
    functionName: "setTokenURI",
    args: [nftTokenId, metadataURI.replace(/^ipfs:\/\//, "")],
  });

  return updateClaimNFTMetadataTx;
};

export const createArgument = async ({
  claimSlug,
  argument,
}: {
  claimSlug: string;
  argument: CreateArgumentProps;
}) => {
  const addedArgument = await ClaimsService.createArgument({
    claimSlug,
    argument,
  });
  ClaimsCache.arguments(
    compact(concat(ClaimsCache.arguments(), addedArgument))
  );
  return addedArgument;
};

export const getArgument = async ({ id }: { id: string }) =>
  await ClaimsService.getArgument({ id });

export const updateArgument = async ({
  id,
  argument,
}: {
  id: string;
  argument: ArgumentProps;
}) => Promise.resolve();

export const setArguments = (argumentsList: ArgumentProps[]) =>
  ClaimsCache.arguments(argumentsList);

export const useArguments = () => {
  const {
    data: { arguments: argumentsList },
  } = useQuery(
    gql`
      query Arguments {
        arguments @client
      }
    `,
    { client: apolloClient }
  );

  return {
    saveArgumentOnIPFS,
    mintArgumentNFT,
    updateArgumentNFTMetadata,
    createArgument,
    updateArgument,
    getArgument,
    setArguments,
    argumentsList,
  };
};
