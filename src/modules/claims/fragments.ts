import { gql } from "@apollo/client";

export const CORE_CLAIM_FIELDS = gql`
  fragment CoreClaimFields on Claim {
    id
    title
    summary
    slug
    origin
    createdAt
    user {
      id
      avatar
      username
    }
    tags {
      id
      label
      slug
    }
    knowledgeBits {
      id
      side
    }
    opinions {
      id
      acceptance
      user {
        username
        avatar
      }
    }
  }
`;

export const KNOWLEDGE_BIT_FIELDS = gql`
  fragment KnowledgeBitFields on KnowledgeBit {
    id
    name
    summary
    side
    type
    customType
    fileURI
    attributions {
      origin
      identifier
    }
    user {
      id
      avatar
      username
    }
    upvotesCount
    downvotesCount
  }
`;

export const CORE_ARGUMENT_FIELDS = gql`
  fragment CoreArgumentFields on Argument {
    id
    summary
    createdAt
    side
    evidences {
      id
    }
    comments {
      id
    }
  }
`;

export const OPINION_FIELDS = gql`
  ${CORE_ARGUMENT_FIELDS}

  fragment OpinionFields on Opinion {
    id
    acceptance
    user {
      username
      avatar
    }
    arguments {
      ...CoreArgumentFields
      opinions {
        user {
          username
          avatar
        }
      }
    }
  }
`;

export const USER_OPINION_FIELDS = gql`
  fragment UserOpinionFields on Opinion {
    id
    acceptance
    arguments {
      id
      summary
      createdAt
      side
      comments {
        id
      }
    }
    user {
      username
      avatar
    }
    claim {
      id
    }
  }
`;
