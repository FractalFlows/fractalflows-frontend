import { makeVar } from "@apollo/client";

import type {
  ArgumentProps,
  ClaimProps,
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  OpinionProps,
} from "./interfaces";

export const ClaimsCache = {
  claim: makeVar({} as ClaimProps),
  disabledClaims: makeVar([] as ClaimProps[]),
  disabledClaimsTotalCount: makeVar(0),
  knowledgeBits: makeVar([] as KnowledgeBitProps[]),
  arguments: makeVar([] as ArgumentProps[]),
  opinions: makeVar([] as OpinionProps[]),
  isOpining: makeVar(false),
  userOpinion: makeVar({} as OpinionProps),
  showOpinionId: makeVar(""),
  userKnowledgeBitVotes: makeVar([] as KnowledgeBitVoteProps[]),
};
