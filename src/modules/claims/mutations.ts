import { gql } from "@apollo/client";
import { USER_OPINION_FIELDS } from "./fragments";

export const UPDATE_CLAIM = gql`
  mutation UpdateClaim($updateClaimInput: UpdateClaimInput!) {
    updateClaim(updateClaimInput: $updateClaimInput) {
      id
      slug
    }
  }
`;

export const DELETE_CLAIM = gql`
  mutation DeleteClaim($id: String!) {
    deleteClaim(id: $id)
  }
`;

export const DISABLE_CLAIM = gql`
  mutation DisableClaim($id: String!) {
    disableClaim(id: $id)
  }
`;

export const REENABLE_CLAIM = gql`
  mutation ReenableClaim($id: String!) {
    reenableClaim(id: $id)
  }
`;

export const ADD_FOLLOWER_TO_CLAIM = gql`
  mutation AddFollowerToClaim($id: String!) {
    addFollowerToClaim(id: $id)
  }
`;

export const REMOVE_FOLLOWER_FROM_CLAIM = gql`
  mutation RemoveFollowerFromClaim($id: String!) {
    removeFollowerFromClaim(id: $id)
  }
`;

export const REQUEST_CLAIM_OWNERSHIP = gql`
  mutation RequestClaimOwnership($id: String!) {
    requestClaimOwnership(id: $id)
  }
`;

export const INVITE_FRIENDS = gql`
  mutation InviteFriends($inviteFriendsInput: InviteFriendsInput!) {
    inviteFriends(inviteFriendsInput: $inviteFriendsInput)
  }
`;

export const DELETE_KNOWLEDGE_BIT = gql`
  mutation DeleteKnowledgeBit($id: String!) {
    deleteKnowledgeBit(id: $id)
  }
`;

export const CREATE_ARGUMENT = gql`
  mutation CreateArgument(
    $claimSlug: String!
    $createArgumentInput: CreateArgumentInput!
  ) {
    createArgument(
      claimSlug: $claimSlug
      createArgumentInput: $createArgumentInput
    ) {
      id
      summary
      createdAt
      side
      user {
        username
        avatar
      }
      comments {
        id
      }
      nftTokenId
    }
  }
`;

export const SAVE_OPINION = gql`
  ${USER_OPINION_FIELDS}

  mutation SaveOpinion($saveOpinionInput: SaveOpinionInput!) {
    saveOpinion(saveOpinionInput: $saveOpinionInput) {
      ...UserOpinionFields
    }
  }
`;
