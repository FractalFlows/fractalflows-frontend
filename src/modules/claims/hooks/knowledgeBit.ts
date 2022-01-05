import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps } from "../interfaces";

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
