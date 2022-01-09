import { apolloClient } from "common/services/apollo/client";

import type { ArgumentCommentProps } from "./interfaces";
import {
  CREATE_ARGUMENT_COMMENT,
  UPDATE_ARGUMENT_COMMENT,
  DELETE_ARGUMENT_COMMENT,
} from "./mutations";

export const ArgumentCommentsService = {
  async createArgumentComment({
    argumentComment,
  }: {
    argumentComment: Partial<ArgumentCommentProps>;
  }): Promise<ArgumentCommentProps> {
    const { data } = await apolloClient.query({
      query: CREATE_ARGUMENT_COMMENT,
      variables: {
        createArgumentCommentInput: argumentComment,
      },
    });

    return data.createArgumentComment;
  },

  async updateArgumentComment({
    argumentComment,
  }: {
    argumentComment: ArgumentCommentProps;
  }): Promise<ArgumentCommentProps> {
    const { data } = await apolloClient.query({
      query: UPDATE_ARGUMENT_COMMENT,
      variables: {
        updateArgumentCommentInput: argumentComment,
      },
    });

    return data.updateArgumentComment;
  },

  async deleteArgumentComment({ id }: { id: string }): Promise<Boolean> {
    const { data } = await apolloClient.query({
      query: DELETE_ARGUMENT_COMMENT,
      variables: {
        id,
      },
    });

    return data.deleteArgumentComment;
  },
};
