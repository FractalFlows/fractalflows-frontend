import { gql } from "@apollo/client";

export const ARGUMENT_COMMENT_FIELDS = gql`
  fragment ArgumentCommentFields on ArgumentComment {
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
`;
