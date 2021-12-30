import { ClaimsService } from "../services/claims";
import { Claim } from "../interfaces";

export const createClaim = async ({ claim }: { claim: Claim }) =>
  await ClaimsService.createClaim({ claim });
