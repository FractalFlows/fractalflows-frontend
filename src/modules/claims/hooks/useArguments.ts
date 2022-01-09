import { compact, concat } from "lodash-es";
import { gql, useQuery } from "@apollo/client";

import { ClaimsService } from "../services/claims";
import type { ArgumentProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";

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

export const getArgument = async ({ id }: { id: string }) =>
  await ClaimsService.getArgument({ id });

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
    data: { arguments: argumentsList },
  } = useQuery(
    gql`
      query Arguments {
        arguments @client
      }
    `,
    { client: apolloClient }
  );

  return {
    createArgument,
    updateArgument,
    getArgument,
    setArguments,
    argumentsList,
  };
};
