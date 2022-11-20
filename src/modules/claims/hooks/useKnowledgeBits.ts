import { gql, useQuery } from "@apollo/client";
import { compact, concat, filter, findIndex, get } from "lodash-es";

import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";

export const getKnowledgeBit = async ({ id }: { id: string }) =>
  await ClaimsService.getKnowledgeBit({ id });

export const saveKnowledgeBitOnIPFS = async ({
  knowledgeBit,
}: {
  knowledgeBit: KnowledgeBitProps;
}) => {
  const savedKnowledgeBit = await ClaimsService.saveKnowledgeBitOnIPFS({
    knowledgeBit,
  });

  return savedKnowledgeBit;
};

export const createKnowledgeBit = async ({
  claimSlug,
  knowledgeBit,
}: {
  claimSlug: string;
  knowledgeBit: KnowledgeBitProps;
}) => {
  const createdKnowledgeBit = await ClaimsService.createKnowledgeBit({
    claimSlug,
    knowledgeBit,
  });
  const updatedKnowledgeBits = compact(
    concat(ClaimsCache.knowledgeBits(), createdKnowledgeBit)
  );
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return createdKnowledgeBit;
};

export const updateKnowledgeBit = async ({
  id,
  knowledgeBit,
}: {
  id: string;
  knowledgeBit: KnowledgeBitProps;
}) => {
  const updatedKnowledgeBit = await ClaimsService.updateKnowledgeBit({
    id,
    knowledgeBit,
  });
  const knowledgeBitIndex = findIndex(ClaimsCache.knowledgeBits(), { id });
  const updatedKnowledgeBits = [...ClaimsCache.knowledgeBits()];
  updatedKnowledgeBits.splice(knowledgeBitIndex, 1, updatedKnowledgeBit);
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return updatedKnowledgeBit;
};

export const deleteKnowledgeBit = async ({ id }: { id: string }) => {
  await ClaimsService.deleteKnowledgeBit({ id });
  const updatedKnowledgeBits = filter(
    ClaimsCache.knowledgeBits(),
    (knowledgeBit) => knowledgeBit.id !== id
  );
  ClaimsCache.knowledgeBits(updatedKnowledgeBits);

  return true;
};

const setKnowledgeBits = (knowledgeBits: KnowledgeBitProps[]) =>
  ClaimsCache.knowledgeBits(knowledgeBits);

export const useKnowledgeBits = () => {
  const {
    data: { knowledgeBits },
  } = useQuery(
    gql`
      query KnowledgeBit {
        knowledgeBits @client
      }
    `,
    { client: apolloClient }
  );

  return {
    getKnowledgeBit,
    saveKnowledgeBitOnIPFS,
    createKnowledgeBit,
    updateKnowledgeBit,
    deleteKnowledgeBit,
    knowledgeBits,
    setKnowledgeBits,
  };
};
