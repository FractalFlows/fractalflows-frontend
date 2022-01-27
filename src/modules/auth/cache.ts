import { makeVar } from "@apollo/client";

import { Session } from "./interfaces";

export const AuthCache = {
  session: makeVar({} as Session),
  isLoadingSession: makeVar(true),
  isSignedIn: makeVar(false),
};
