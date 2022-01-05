import { createClaim } from "./create";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import { getClaim, getPartialClaim, getClaims, getTrendingClaims } from "./get";

export const useClaims = () => {
  return {
    getClaim,
    getPartialClaim,
    getClaims,
    getTrendingClaims,
    createClaim,
    updateClaim,
    deleteClaim,
    inviteFriends,
  };
};
