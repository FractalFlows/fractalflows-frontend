import { createClaim } from "./createClaim";
import { loadClaim } from "./loadClaim";

export const useClaims = () => {
  return {
    createClaim,
    loadClaim,
  };
};
