import { ClaimsService } from "../services/claims";
import type { Claim } from "../interfaces";

export const createClaim = async ({ claim }: { claim: ClaimProps }) =>
  await ClaimsService.createClaim({ claim });
