import { ClaimsService } from "../services/claims";
import { Claim, GetUserClaimsProps, UserClaimRelation } from "../interfaces";

export const getClaim = async ({ slug }: { slug: string }) =>
  await ClaimsService.getClaim({ slug });

export const getUserClaims = async ({
  username,
  relation,
}: GetUserClaimsProps) =>
  await ClaimsService.getUserClaims({ username, relation });
