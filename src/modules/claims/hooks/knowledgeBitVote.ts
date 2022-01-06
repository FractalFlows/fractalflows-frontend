import { ClaimsService } from "../services/claims";
import type { KnowledgeBitVoteTypes } from "../interfaces";

export const saveKnowledgeBitVote = async ({
  knowledgeBitId,
  type,
}: {
  knowledgeBitId: string;
  type: KnowledgeBitVoteTypes;
}) => await ClaimsService.saveKnowledgeBitVote({ knowledgeBitId, type });

export const getUserKnowledgeBitsVotes = async ({
  claimSlug,
}: {
  claimSlug: string;
}) => await ClaimsService.getUserKnowledgeBitsVotes({ claimSlug });
