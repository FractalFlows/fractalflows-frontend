import { createClaim } from "./create";
import { getClaim, getClaims, getTrendingClaims } from "./get";

export const useClaims = () => {
  return {
    createClaim,
    getClaim,
    getClaims,
    getTrendingClaims,
  };
};
