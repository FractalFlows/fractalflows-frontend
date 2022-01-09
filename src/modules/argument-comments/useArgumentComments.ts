import { concat, get, findIndex, compact, filter } from "lodash-es";

import { ClaimsCache } from "modules/claims/cache";
import { ArgumentCommentProps } from "./interfaces";
import { ArgumentCommentsService } from "./services";

export const createArgumentComment = async ({
  argumentComment,
}: {
  argumentComment: Partial<ArgumentCommentProps>;
}) => {
  const addedArgumentComment =
    await ArgumentCommentsService.createArgumentComment({
      argumentComment,
    });
  const argumentIndex = findIndex(ClaimsCache.arguments(), {
    id: get(argumentComment, "argument.id"),
  });
  const argument = ClaimsCache.arguments()[argumentIndex];
  const updatedArguments = [...ClaimsCache.arguments()];
  updatedArguments.splice(argumentIndex, 1, {
    ...argument,
    comments: compact(concat(argument.comments, addedArgumentComment)),
  });
  ClaimsCache.arguments(updatedArguments);

  return addedArgumentComment;
};

export const updateArgumentComment = async ({
  argumentComment,
}: {
  argumentComment: ArgumentCommentProps;
}) => {
  const addedArgumentComment =
    await ArgumentCommentsService.updateArgumentComment({
      argumentComment,
    });
  return addedArgumentComment;
};

export const deleteArgumentComment = async ({
  argumentComment,
}: {
  argumentComment: ArgumentCommentProps;
}) => {
  await ArgumentCommentsService.deleteArgumentComment({
    id: argumentComment.id,
  });
  const argumentIndex = findIndex(ClaimsCache.arguments(), {
    id: get(argumentComment, "argument.id"),
  });
  const argument = ClaimsCache.arguments()[argumentIndex];
  const updatedArguments = [...ClaimsCache.arguments()];
  updatedArguments.splice(argumentIndex, 1, {
    ...argument,
    comments: filter(
      argument.comments,
      (existingArgumentComment) =>
        existingArgumentComment.id !== argumentComment.id
    ),
  });
  ClaimsCache.arguments(updatedArguments);

  return true;
};

export const useArgumentComments = () => {
  return {
    createArgumentComment,
    updateArgumentComment,
    deleteArgumentComment,
  };
};
