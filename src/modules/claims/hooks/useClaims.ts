import { createClaim } from "./create";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import {
  createKnowledgeBit,
  updateKnowledgeBit,
  deleteKnowledgeBit,
} from "./knowledgeBit";
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
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
  };
};
