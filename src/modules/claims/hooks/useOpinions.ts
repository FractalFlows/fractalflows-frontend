import { ClaimsService } from "../services/claims";
import type { ArgumentProps, OpinionProps } from "../interfaces";
import { ClaimsCache } from "../cache";
import { gql, useQuery } from "@apollo/client";
import { apolloClient } from "common/services/apollo/client";

export const saveOpinion = async ({ opinion }: { opinion: OpinionProps }) => {
  const savedOpinion = await ClaimsService.saveOpinion({
    opinion: {
      ...opinion,
      arguments: opinion.arguments.map(({ id }) => ({ id })),
      claim: {
        id: opinion.claim.id,
      },
    },
  });
  ClaimsCache.opinion(savedOpinion);

  return savedOpinion;
};

export const getOpinion = async ({ id }: { id: string }) =>
  await ClaimsService.getOpinion({ id });

export const setOpinionAcceptance = (acceptance: number) =>
  ClaimsCache.opinion({
    ...ClaimsCache.opinion(),
    acceptance,
  });

export const addArgumentToOpinion = (argument: ArgumentProps) =>
  ClaimsCache.opinion({
    ...ClaimsCache.opinion(),
    arguments: [...ClaimsCache.opinion().arguments, argument],
  });

export const removeArgumentFromOpinion = (argumentId: string) =>
  ClaimsCache.opinion({
    ...ClaimsCache.opinion(),
    arguments: ClaimsCache.opinion().arguments.filter(
      ({ id }: ArgumentProps) => id !== argumentId
    ),
  });

export const setOpinion = (opinion: OpinionProps) =>
  ClaimsCache.opinion(opinion);

export const setOpinions = (opinions: OpinionProps[]) =>
  ClaimsCache.opinions(opinions);

export const setIsOpining = (isOpining: boolean) =>
  ClaimsCache.isOpining(isOpining);

export const setShowOpinionId = (opinionId: string) =>
  ClaimsCache.showOpinionId(opinionId);

export const useOpinions = () => {
  const {
    data: { isOpining, opinion, opinions, showOpinionId },
  } = useQuery(
    gql`
      query Opinion {
        opinion @client
        showOpinionId @client
        opinions @client
        isOpining @client
      }
    `,
    { client: apolloClient }
  );

  return {
    saveOpinion,
    setOpinion,
    getOpinion,
    setOpinionAcceptance,
    addArgumentToOpinion,
    removeArgumentFromOpinion,
    opinions,
    setOpinions,
    opinion,
    isOpining,
    showOpinionId,
    setIsOpining,
    setShowOpinionId,
  };
};
