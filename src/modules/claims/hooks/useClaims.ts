import { getClaim, getPartialClaim, getClaims, getTrendingClaims } from "./get";
import { createClaim } from "./create";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import {
  getKnowledgeBit,
  createKnowledgeBit,
  updateKnowledgeBit,
  deleteKnowledgeBit,
} from "./knowledgeBit";

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
    getKnowledgeBit,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
  };
};
