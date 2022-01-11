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
import { ClaimsService } from "../services/claims";
import { PaginationProps } from "modules/interfaces";

const searchClaims = async ({
  term,
  limit,
  offset,
}: { term: string } & PaginationProps) => {
  return await ClaimsService.searchClaims({ term, limit, offset });
};

const disableClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.disableClaim({ id });
};

const addFollowerToClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.addFollowerToClaim({ id });
};

const removeFollowerFromClaim = async ({ id }: { id: string }) => {
  return await ClaimsService.removeFollowerFromClaim({ id });
};

export const useClaims = () => {
  return {
    getClaim,
    getPartialClaim,
    getClaims,
    getTrendingClaims,
    searchClaims,
    createClaim,
    updateClaim,
    deleteClaim,
    disableClaim,
    addFollowerToClaim,
    removeFollowerFromClaim,
    inviteFriends,
    getKnowledgeBit,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
  };
};
