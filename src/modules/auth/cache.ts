import { makeVar } from "@apollo/client";

import { Session } from "./interfaces";

export const AuthCache = {
  sessionVar: makeVar({} as Session | {}),
  isSignedInVar: makeVar(false),
};
