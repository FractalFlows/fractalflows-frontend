import { gql, useQuery } from "@apollo/client";

import { ClaimsService } from "../services/claims";
import type { KnowledgeBitProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";

export const setKnowledgeBits = (knowledgeBits: KnowledgeBitProps[]) =>
  ClaimsCache.knowledgeBits(knowledgeBits);

export const useKnowledgeBits = () => {
  const {
    data: { knowledgeBits },
  } = useQuery(
    gql`
      query Opinion {
        knowledgeBits @client
      }
    `,
    { client: apolloClient }
  );

  return {
    knowledgeBits,
    setKnowledgeBits,
  };
};
