import { ClaimsService } from "../services/claims";
import type { ArgumentProps, CreateArgumentProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { gql, useQuery } from "@apollo/client";
import { apolloClient } from "common/services/apollo/client";
import Claims from "pages/user/claims";
import { compact, concat } from "lodash-es";

// export const getKnowledgeBit = async ({ id }: { id: string }) =>
//   await ClaimsService.getKnowledgeBit({ id });

// export const getKnowledgeBits = async ({ claimSlug }: { claimSlug: string }) =>
//   await ClaimsService.getKnowledgeBits({ claimSlug });

export const createArgument = async ({
  claimSlug,
  argument,
}: {
  claimSlug: string;
  argument: CreateArgumentProps;
}) => {
  const addedArgument = await ClaimsService.createArgument({
    claimSlug,
    argument,
  });
  ClaimsCache.arguments(
    compact(concat(ClaimsCache.arguments(), addedArgument))
  );
  return addedArgument;
};

export const updateArgument = async ({
  id,
  argument,
}: {
  id: string;
  argument: ArgumentProps;
}) => Promise.resolve();

export const setArguments = (argumentsList: ArgumentProps[]) =>
  ClaimsCache.arguments(argumentsList);

export const useArguments = () => {
  const {
    data: { arguments: argumentsList, pickedArguments },
  } = useQuery(
    gql`
      query Arguments {
        arguments @client
        pickedArguments @client
      }
    `,
    { client: apolloClient }
  );

  return {
    createArgument,
    updateArgument,
    setArguments,
    argumentsList,
    pickedArguments,
  };
};
