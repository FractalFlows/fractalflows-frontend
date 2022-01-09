import { makeVar } from "@apollo/client";

import type {
  ArgumentProps,
  KnowledgeBitProps,
  KnowledgeBitVoteProps,
  OpinionProps,
} from "./interfaces";

export const ClaimsCache = {
  knowledgeBits: makeVar([] as KnowledgeBitProps[]),
  arguments: makeVar([] as ArgumentProps[]),
  opinions: makeVar([] as OpinionProps[]),
  isOpining: makeVar(false),
  userOpinion: makeVar({} as OpinionProps),
  showOpinionId: makeVar(null),
  userKnowledgeBitVotes: makeVar([] as KnowledgeBitVoteProps[]),
};
