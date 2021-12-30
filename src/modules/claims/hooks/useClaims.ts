import { useQuery } from "@apollo/client";

import { apolloClient } from "common/services/apollo/client";
import { createClaim } from "./createClaim";

export const useClaims = () => {
  return {
    createClaim,
  };
};
