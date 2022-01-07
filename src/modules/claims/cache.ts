import { makeVar } from "@apollo/client";

import type { ArgumentProps } from "./interfaces";

export const ClaimsCache = {
  arguments: makeVar([] as ArgumentProps[]),
  pickedArguments: makeVar([] as ArgumentProps[]),
  isOpining: makeVar(false),
};
