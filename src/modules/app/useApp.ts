import { gql, useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { AppCache } from "./cache";

const setIsChangingRoutes = (isChangingRoutes: boolean) => {
  AppCache.isChangingRoutes(isChangingRoutes);
};

export const useApp = () => {
  const {
    data: { isChangingRoutes },
  } = useQuery(
    gql`
      query App {
        isChangingRoutes @client
      }
    `,
    { client: apolloClient }
  );

  return {
    isChangingRoutes,
    setIsChangingRoutes,
  };
};
