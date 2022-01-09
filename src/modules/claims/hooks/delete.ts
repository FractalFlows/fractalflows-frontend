import { ClaimsService } from "../services/claims";

export const deleteClaim = async ({ id }: { id: string }) =>
  await ClaimsService.deleteClaim({ id });
