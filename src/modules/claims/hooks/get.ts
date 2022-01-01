import { ClaimsService } from "../services/claims";
import { Claim, UserClaimRelation } from "../interfaces";

export const getClaim = async ({ slug }: { slug: string }): Promise<Claim> =>
  await ClaimsService.getClaim({ slug });

export const getUserClaims = async ({
  relation,
}: {
  relation: UserClaimRelation;
}): Promise<Claim[]> => await ClaimsService.getUserClaims({ relation });
