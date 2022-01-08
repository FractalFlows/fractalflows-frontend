import { makeVar } from "@apollo/client";

import type { ArgumentProps, OpinionProps } from "./interfaces";

export const ClaimsCache = {
  arguments: makeVar([] as ArgumentProps[]),
  pickedArguments: makeVar([] as ArgumentProps[]),
  opinions: makeVar([] as OpinionProps[]),
  isOpining: makeVar(false),
  userOpinion: makeVar({} as OpinionProps),
  showOpinionId: makeVar(null),
};
