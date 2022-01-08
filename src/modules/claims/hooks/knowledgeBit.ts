import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps, KnowledgeBitSides } from "../interfaces";

export const getKnowledgeBit = async ({ id }: { id: string }) =>
  await ClaimsService.getKnowledgeBit({ id });

export const getKnowledgeBits = async ({
  claimSlug,
  side,
}: {
  claimSlug: string;
  side: KnowledgeBitSides;
}) => await ClaimsService.getKnowledgeBits({ claimSlug, side });

export const createKnowledgeBit = async ({
  claimSlug,
  knowledgeBit,
}: {
  claimSlug: string;
  knowledgeBit: KnowledgeBitProps;
}) => await ClaimsService.createKnowledgeBit({ claimSlug, knowledgeBit });

export const updateKnowledgeBit = async ({
  id,
  knowledgeBit,
}: {
  id: string;
  knowledgeBit: KnowledgeBitProps;
}) => await ClaimsService.updateKnowledgeBit({ id, knowledgeBit });

export const deleteKnowledgeBit = async ({ id }: { id: string }) =>
  await ClaimsService.deleteKnowledgeBit({ id });
