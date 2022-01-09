import { ClaimsService } from "../services/claims";
import type { ClaimProps } from "../interfaces";

export const updateClaim = async ({
  id,
  claim,
}: {
  id: string;
  claim: ClaimProps;
}) => await ClaimsService.updateClaim({ id, claim });
