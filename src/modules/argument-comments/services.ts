import { gql } from "@apollo/client";
import { apolloClient } from "common/services/apollo/client";
import { ARGUMENT_COMMENT_FIELDS } from "./fragments";

import type { ArgumentCommentProps } from "./interfaces";

export const ArgumentCommentsService = {
  async saveOnIPFS({
    argumentComment,
  }: {
    argumentComment: Partial<ArgumentCommentProps>;
  }): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation SaveArgumentCommentOnIPFS(
          $saveArgumentCommentOnIPFSInput: ArgumentCommentInput!
        ) {
          saveArgumentCommentOnIPFS(
            saveArgumentCommentOnIPFSInput: $saveArgumentCommentOnIPFSInput
          )
        }
      `,
      variables: {
        saveArgumentCommentOnIPFSInput: argumentComment,
      },
    });

    return data.saveArgumentCommentOnIPFS;
  },

  async createArgumentComment({
    argumentComment,
  }: {
    argumentComment: Partial<ArgumentCommentProps>;
  }): Promise<ArgumentCommentProps> {
    const { data } = await apolloClient.query({
      query: gql`
        ${ARGUMENT_COMMENT_FIELDS}

        mutation CreateArgumentComment(
          $createArgumentCommentInput: CreateArgumentCommentInput!
        ) {
          createArgumentComment(
            createArgumentCommentInput: $createArgumentCommentInput
          ) {
            ...ArgumentCommentFields
          }
        }
      `,
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
      query: gql`
        ${ARGUMENT_COMMENT_FIELDS}

        mutation UpdateArgumentComment(
          $updateArgumentCommentInput: UpdateArgumentCommentInput!
        ) {
          updateArgumentComment(
            updateArgumentCommentInput: $updateArgumentCommentInput
          ) {
            ...ArgumentCommentFields
          }
        }
      `,
      variables: {
        updateArgumentCommentInput: argumentComment,
      },
    });

    return data.updateArgumentComment;
  },

  async deleteArgumentComment({ id }: { id: string }): Promise<Boolean> {
    const { data } = await apolloClient.query({
      query: gql`
        mutation DeleteArgumentComment($id: String!) {
          deleteArgumentComment(id: $id)
        }
      `,
      variables: {
        id,
      },
    });

    return data.deleteArgumentComment;
  },
};
