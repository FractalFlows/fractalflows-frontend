import { makeVar } from "@apollo/client";

import { Session } from "./interfaces";

export const AuthCache = {
  session: makeVar({} as Session),
  isSignedIn: makeVar(false),
};
