import { gql, useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { AppCache } from "./cache";

const setIsChangingRoutes = (isChangingRoutes: boolean) => {
  AppCache.isChangingRoutes(isChangingRoutes);
};

const setIsSignInDialogOpen = (isSignInDialogOpen: boolean) => {
  AppCache.isSignInDialogOpen(isSignInDialogOpen);
};

export const useApp = () => {
  const {
    data: { isChangingRoutes, isSignInDialogOpen },
  } = useQuery(
    gql`
      query App {
        isChangingRoutes @client
        isSignInDialogOpen @client
      }
    `,
    { client: apolloClient }
  );

  return {
    isChangingRoutes,
    setIsChangingRoutes,
    isSignInDialogOpen,
    setIsSignInDialogOpen,
  };
};
