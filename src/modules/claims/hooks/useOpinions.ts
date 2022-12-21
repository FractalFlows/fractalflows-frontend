import { gql, useQuery } from "@apollo/client";
import {
  filter,
  find,
  concat,
  findIndex,
  get,
  map,
  compact,
  pick,
} from "lodash-es";

import { ClaimsService } from "../services/claims";
import type { ArgumentProps, OpinionProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import OpinionContractABI from "../../../../artifacts/contracts/Opinion.sol/Opinion.json";
import { generateNFTId } from "common/utils/transactions";
import { ContractCtrl } from "@web3modal/core";

export const saveOpinionOnIPFS = async ({
  opinion,
}: {
  opinion: Partial<OpinionProps>;
}) => {
  const saveOpinionOnIPFSResult = await ClaimsService.saveOpinionOnIPFS({
    opinion,
  });

  return saveOpinionOnIPFSResult;
};

export const mintOpinionNFT = async ({
  metadataURI,
  argumentTokenIds,
  claimTokenId,
}: {
  metadataURI: string;
  argumentTokenIds?: string[];
  claimTokenId: string;
}) => {
  const mintKnowledgeBitNFTTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_OPINION_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: OpinionContractABI.abi,
    functionName: "mintToken",
    args: [
      metadataURI.replace(/^ipfs:\/\//, ""),
      generateNFTId(),
      argumentTokenIds,
      claimTokenId,
    ],
  });

  return mintKnowledgeBitNFTTx;
};

export const updateOpinionNFTMetadata = async ({
  nftTokenId,
  metadataURI,
  argumentTokenIds,
}: {
  nftTokenId: string;
  metadataURI: string;
  argumentTokenIds: string[];
}) => {
  const updateClaimNFTMetadataTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_OPINION_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: OpinionContractABI.abi,
    functionName: "setTokenURI",
    args: [nftTokenId, metadataURI.replace(/^ipfs:\/\//, ""), argumentTokenIds],
  });

  return updateClaimNFTMetadataTx;
};

export const saveOpinion = async ({ opinion }: { opinion: OpinionProps }) => {
  const savedOpinion = await ClaimsService.saveOpinion({
    opinion: {
      ...pick(opinion, [
        "id",
        "acceptance",
        "nftTokenId",
        "nftTxHash",
        "nftMetadataURI",
      ]),
      arguments: opinion.arguments.map(({ id }) => ({ id })),
      claim: {
        id: opinion.claim.id,
      },
    },
  });

  if (get(ClaimsCache.userOpinion(), "id")) {
    const userOpinionIndex = findIndex(ClaimsCache.opinions(), {
      id: ClaimsCache.userOpinion().id,
    });
    const updatedOpinions = [...ClaimsCache.opinions()];
    updatedOpinions.splice(userOpinionIndex, 1, savedOpinion);
    ClaimsCache.opinions(updatedOpinions);
  } else {
    ClaimsCache.opinions(compact(concat(ClaimsCache.opinions(), savedOpinion)));
  }

  const updatedArguments = map(ClaimsCache.arguments(), (argument) => {
    const opinionUsesArgument = find(savedOpinion?.arguments, {
      id: argument.id,
    });

    if (opinionUsesArgument) {
      const opinionAlreadyInArgumentOpinionsList = find(argument.opinions, {
        id: savedOpinion.id,
      });

      if (opinionAlreadyInArgumentOpinionsList) {
        return argument;
      } else {
        return {
          ...argument,
          opinions: compact(concat(argument.opinions, savedOpinion)),
        };
      }
    } else {
      return {
        ...argument,
        opinions: filter(
          argument?.opinions,
          (opinion) => opinion.id !== savedOpinion.id
        ),
      };
    }
  });

  ClaimsCache.userOpinion(savedOpinion);
  ClaimsCache.arguments(updatedArguments);

  return savedOpinion;
};

export const getOpinion = async ({ id }: { id: string }) =>
  await ClaimsService.getOpinion({ id });

export const setOpinionAcceptance = (acceptance: number) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    acceptance,
  });

export const addArgumentToOpinion = (argument: ArgumentProps) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    arguments: [...get(ClaimsCache.userOpinion(), "arguments", []), argument],
  });

export const removeArgumentFromOpinion = (argumentId: string) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    arguments: ClaimsCache.userOpinion().arguments.filter(
      ({ id }: ArgumentProps) => id !== argumentId
    ),
  });

export const getUserOpinion = async ({ claimSlug }: { claimSlug: string }) => {
  const userOpinion = await ClaimsService.getUserOpinion({ claimSlug });
  if (userOpinion) ClaimsCache.userOpinion(userOpinion);
  return userOpinion;
};

export const setUserOpinion = (userOpinion: OpinionProps) =>
  ClaimsCache.userOpinion(userOpinion);

export const setOpinions = (opinions: OpinionProps[]) =>
  ClaimsCache.opinions(opinions);

export const setIsOpining = (isOpining: boolean) =>
  ClaimsCache.isOpining(isOpining);

export const setShowOpinionId = (opinionId: string) =>
  ClaimsCache.showOpinionId(opinionId);

export const useOpinions = () => {
  const {
    data: { isOpining, userOpinion, opinions, showOpinionId },
  } = useQuery(
    gql`
      query Opinion {
        userOpinion @client
        showOpinionId @client
        opinions @client
        isOpining @client
      }
    `,
    { client: apolloClient }
  );

  return {
    saveOpinionOnIPFS,
    mintOpinionNFT,
    updateOpinionNFTMetadata,
    saveOpinion,
    getOpinion,
    setOpinionAcceptance,
    addArgumentToOpinion,
    removeArgumentFromOpinion,
    opinions,
    setOpinions,
    userOpinion,
    setUserOpinion,
    getUserOpinion,
    isOpining,
    showOpinionId,
    setIsOpining,
    setShowOpinionId,
  };
};
