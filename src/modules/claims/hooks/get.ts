import { ClaimsService } from "../services/claims";

export const getClaim = async ({ slug }: { slug: string }) =>
  await ClaimsService.getClaim({ slug });
