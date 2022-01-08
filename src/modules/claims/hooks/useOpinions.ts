import { gql, useQuery } from "@apollo/client";
import { filter, find, findIndex, get, map } from "lodash-es";

import { ClaimsService } from "../services/claims";
import type { ArgumentProps, OpinionProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { apolloClient } from "common/services/apollo/client";

export const saveOpinion = async ({ opinion }: { opinion: OpinionProps }) => {
  const savedOpinion = await ClaimsService.saveOpinion({
    opinion: {
      id: opinion.id,
      acceptance: opinion.acceptance,
      arguments: opinion.arguments.map(({ id }) => ({ id })),
      claim: {
        id: opinion.claim.id,
      },
    },
  });

  if (get(ClaimsCache.userOpinion(), "id")) {
    const userOpinionIndex = findIndex(ClaimsCache.opinions(), {
      id: ClaimsCache.userOpinion().id,
    });
    const updatedOpinions = [...ClaimsCache.opinions()];
    updatedOpinions.splice(userOpinionIndex, 1, savedOpinion);
    ClaimsCache.opinions(updatedOpinions);
  }

  const updatedArguments = map(ClaimsCache.arguments(), (argument) => {
    const opinionUsesArgument = find(savedOpinion?.arguments, {
      id: argument.id,
    });

    if (opinionUsesArgument) {
      const opinionAlreadyInArgumentOpinionsList = find(argument.opinions, {
        id: savedOpinion.id,
      });

      if (opinionAlreadyInArgumentOpinionsList) {
        return argument;
      } else {
        return {
          ...argument,
          opinions: [...argument.opinions, savedOpinion],
        };
      }
    } else {
      return {
        ...argument,
        opinions: filter(
          argument?.opinions,
          (opinion) => opinion.id !== savedOpinion.id
        ),
      };
    }
  });

  ClaimsCache.userOpinion(savedOpinion);
  ClaimsCache.arguments(updatedArguments);

  return savedOpinion;
};

export const getOpinion = async ({ id }: { id: string }) =>
  await ClaimsService.getOpinion({ id });

export const setOpinionAcceptance = (acceptance: number) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    acceptance,
  });

export const addArgumentToOpinion = (argument: ArgumentProps) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    arguments: [...get(ClaimsCache.userOpinion(), "arguments", []), argument],
  });

export const removeArgumentFromOpinion = (argumentId: string) =>
  ClaimsCache.userOpinion({
    ...ClaimsCache.userOpinion(),
    arguments: ClaimsCache.userOpinion().arguments.filter(
      ({ id }: ArgumentProps) => id !== argumentId
    ),
  });

export const getUserOpinion = async ({ claimSlug }: { claimSlug: string }) => {
  const userOpinion = await ClaimsService.getUserOpinion({ claimSlug });
  if (userOpinion) ClaimsCache.userOpinion(userOpinion);
  return userOpinion;
};

export const setUserOpinion = (userOpinion: OpinionProps) =>
  ClaimsCache.userOpinion(userOpinion);

export const setOpinions = (opinions: OpinionProps[]) =>
  ClaimsCache.opinions(opinions);

export const setIsOpining = (isOpining: boolean) =>
  ClaimsCache.isOpining(isOpining);

export const setShowOpinionId = (opinionId: string) =>
  ClaimsCache.showOpinionId(opinionId);

export const useOpinions = () => {
  const {
    data: { isOpining, userOpinion, opinions, showOpinionId },
  } = useQuery(
    gql`
      query Opinion {
        userOpinion @client
        showOpinionId @client
        opinions @client
        isOpining @client
      }
    `,
    { client: apolloClient }
  );

  return {
    saveOpinion,
    getOpinion,
    setOpinionAcceptance,
    addArgumentToOpinion,
    removeArgumentFromOpinion,
    opinions,
    setOpinions,
    userOpinion,
    setUserOpinion,
    getUserOpinion,
    isOpining,
    showOpinionId,
    setIsOpining,
    setShowOpinionId,
  };
};
