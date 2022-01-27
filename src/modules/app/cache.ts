import { makeVar } from "@apollo/client";

export const AppCache = {
  isSignInDialogOpen: makeVar(false),
  isChangingRoutes: makeVar(false),
  signInCallback: undefined,
};
