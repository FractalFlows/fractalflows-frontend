import { ClaimsService } from "../services/claims";
import type { ArgumentProps, CreateArgumentProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { gql, useQuery } from "@apollo/client";
import { apolloClient } from "common/services/apollo/client";
import Claims from "pages/user/claims";

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
  ClaimsCache.arguments([...ClaimsCache.arguments(), addedArgument]);

  return addedArgument;
};

export const updateArgument = async ({
  id,
  argument,
}: {
  id: string;
  argument: ArgumentProps;
}) => Promise.resolve();

export const addPickedArgument = (argument: ArgumentProps) =>
  ClaimsCache.pickedArguments([...ClaimsCache.pickedArguments(), argument]);

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
    addPickedArgument,
    argumentsList,
    pickedArguments,
  };
};
