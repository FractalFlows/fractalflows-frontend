import { ClaimsService } from "../services/claims";
import { Claim } from "../interfaces";

export const loadClaim = async ({ slug }: { slug: string }): Promise<Claim> =>
  await ClaimsService.loadClaim({ slug });
