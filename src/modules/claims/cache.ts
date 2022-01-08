import { makeVar } from "@apollo/client";

import type {
  ArgumentProps,
  KnowledgeBitProps,
  OpinionProps,
} from "./interfaces";

export const ClaimsCache = {
  knowledgeBits: makeVar([] as KnowledgeBitProps[]),
  arguments: makeVar([] as ArgumentProps[]),
  pickedArguments: makeVar([] as ArgumentProps[]),
  opinions: makeVar([] as OpinionProps[]),
  isOpining: makeVar(false),
  userOpinion: makeVar({} as OpinionProps),
  showOpinionId: makeVar(null),
};
