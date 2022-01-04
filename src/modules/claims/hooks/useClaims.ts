import { createClaim } from "./create";
import { updateClaim } from "./update";
import { getClaim, getClaims, getTrendingClaims } from "./get";

export const useClaims = () => {
  return {
    getClaim,
    getClaims,
    getTrendingClaims,
    createClaim,
    updateClaim,
  };
};
