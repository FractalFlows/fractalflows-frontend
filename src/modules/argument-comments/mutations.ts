import { gql } from "@apollo/client";

export const CREATE_ARGUMENT_COMMENT = gql`
  mutation CreateArgumentComment(
    $createArgumentCommentInput: CreateArgumentCommentInput!
  ) {
    createArgumentComment(
      createArgumentCommentInput: $createArgumentCommentInput
    ) {
      id
      content
      createdAt
      argument {
        id
      }
      user {
        id
        username
        avatar
      }
    }
  }
`;
