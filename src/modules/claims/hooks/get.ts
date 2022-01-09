import { PaginationProps } from "modules/interfaces";
import { ClaimsService } from "../services/claims";

export const getClaim = async ({ slug }: { slug: string }) =>
  await ClaimsService.getClaim({ slug });

export const getPartialClaim = async ({ slug }: { slug: string }) =>
  await ClaimsService.getPartialClaim({ slug });

export const getTrendingClaims = async ({ limit, offset }: PaginationProps) =>
  await ClaimsService.getTrendingClaims({ limit, offset });

export const getClaims = async ({ limit, offset }: PaginationProps) =>
  await ClaimsService.getClaims({ limit, offset });
