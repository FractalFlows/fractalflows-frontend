import { gql } from "@apollo/client";
import { ARGUMENT_COMMENT_FIELDS } from "./fragments";

export const CREATE_ARGUMENT_COMMENT = gql`
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
`;

export const UPDATE_ARGUMENT_COMMENT = gql`
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
`;
