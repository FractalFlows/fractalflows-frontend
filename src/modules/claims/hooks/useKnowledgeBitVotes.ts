import { gql, useQuery } from "@apollo/client";
import { findIndex } from "lodash-es";
import { ContractCtrl } from "@web3modal/core";

import { ClaimsService } from "../services/claims";
import type {
  KnowledgeBitVoteProps,
  KnowledgeBitVoteTypes,
} from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import { getKnowledgeBit } from "./useKnowledgeBits";
import KnowledgeBitContractABI from "../../../../artifacts/contracts/KnowledgeBit.sol/KnowledgeBit.json";

const getUserKnowledgeBitVotes = async ({
  claimSlug,
}: {
  claimSlug: string;
}) => {
  const userKnowledgeBitVotes = await ClaimsService.getUserKnowledgeBitVotes({
    claimSlug,
  });
  ClaimsCache.userKnowledgeBitVotes(userKnowledgeBitVotes);
  return userKnowledgeBitVotes;
};

export const voteKnowledgeBitNFT = async ({
  nftTokenId,
  voteTypeFn,
}: {
  voteType: "upvote" | "downvote" | "unvote";
  nftTokenId: string;
}) => {
  const updateClaimNFTMetadataTx = await ContractCtrl.write({
    address: process.env.NEXT_PUBLIC_KNOWLEDGE_BIT_CONTRACT_ADDRESS as string,
    chainId: Number(process.env.NEXT_PUBLIC_NETWORK_ID),
    abi: KnowledgeBitContractABI.abi,
    functionName: voteTypeFn,
    args: [nftTokenId],
  });

  return updateClaimNFTMetadataTx;
};

export const saveKnowledgeBitVote = async ({
  knowledgeBitId,
  claimSlug,
  voteType,
}: {
  knowledgeBitId: string;
  claimSlug: string;
  voteType: KnowledgeBitVoteTypes;
}) => {
  await ClaimsService.saveKnowledgeBitVote({ knowledgeBitId, voteType });
  const [updatedKnowledgeBit] = await Promise.all([
    getKnowledgeBit({
      id: knowledgeBitId,
    }),
    getUserKnowledgeBitVotes({
      claimSlug,
    }),
  ]);
  const knowledgeBitIndex = findIndex(ClaimsCache.knowledgeBits(), {
    id: knowledgeBitId,
  });
  const updatedKnowledgeBits = [...ClaimsCache.knowledgeBits()];
  updatedKnowledgeBits.splice(knowledgeBitIndex, 1, updatedKnowledgeBit);
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);
};

const setUserKnowledgeBitVotes = (
  userKnowledgeBitVotes: KnowledgeBitVoteProps[]
) => ClaimsCache.userKnowledgeBitVotes(userKnowledgeBitVotes);

export const useKnowledgeBitsVotes = () => {
  const {
    data: { userKnowledgeBitVotes },
  } = useQuery(
    gql`
      query KnowledgeBit {
        userKnowledgeBitVotes @client
      }
    `,
    { client: apolloClient }
  );

  return {
    userKnowledgeBitVotes,
    voteKnowledgeBitNFT,
    setUserKnowledgeBitVotes,
    saveKnowledgeBitVote,
    getUserKnowledgeBitVotes,
  };
};
