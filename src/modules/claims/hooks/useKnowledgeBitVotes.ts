import { gql, useQuery } from "@apollo/client";

import { ClaimsService } from "../services/claims";
import type {
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  KnowledgeBitVoteTypes,
} from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";
import { getKnowledgeBit } from "./useKnowledgeBits";
import { findIndex } from "lodash-es";

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

export const saveKnowledgeBitVote = async ({
  knowledgeBitId,
  claimSlug,
  type,
}: {
  knowledgeBitId: string;
  claimSlug: string;
  type: KnowledgeBitVoteTypes;
}) => {
  await ClaimsService.saveKnowledgeBitVote({ knowledgeBitId, type });
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
    setUserKnowledgeBitVotes,
    saveKnowledgeBitVote,
    getUserKnowledgeBitVotes,
  };
};
