import { getClaim, getPartialClaim, getClaims, getTrendingClaims } from "./get";
import { createClaim } from "./create";
import { updateClaim } from "./update";
import { deleteClaim } from "./delete";
import { inviteFriends } from "./inviteFriends";
import {
  getKnowledgeBit,
  getKnowledgeBits,
  createKnowledgeBit,
  updateKnowledgeBit,
  deleteKnowledgeBit,
} from "./knowledgeBit";
import {
  saveKnowledgeBitVote,
  getUserKnowledgeBitsVotes,
} from "./knowledgeBitVote";

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
    getKnowledgeBits,
    getUserKnowledgeBitsVotes,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
    saveKnowledgeBitVote,
  };
};
