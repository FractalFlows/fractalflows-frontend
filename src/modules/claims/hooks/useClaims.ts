import { createClaim } from "./create";
import { getClaim } from "./get";

export const useClaims = () => {
  return {
    createClaim,
    getClaim,
  };
};
