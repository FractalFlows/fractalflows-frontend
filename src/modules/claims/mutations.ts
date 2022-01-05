import { gql } from "@apollo/client";

export const CREATE_CLAIM = gql`
  mutation CreateClaim($createClaimInput: CreateClaimInput!) {
    createClaim(createClaimInput: $createClaimInput) {
      id
      slug
    }
  }
`;

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

export const INVITE_FRIENDS = gql`
  mutation InviteFriends($inviteFriendsInput: InviteFriendsInput!) {
    inviteFriends(inviteFriendsInput: $inviteFriendsInput)
  }
`;
