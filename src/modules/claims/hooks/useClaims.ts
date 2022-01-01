import { createClaim } from "./create";
import { getClaim, getUserClaims } from "./get";

export const useClaims = () => {
  return {
    createClaim,
    getClaim,
    getUserClaims,
  };
};
