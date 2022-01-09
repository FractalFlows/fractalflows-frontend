import { ClaimsService } from "../services/claims";
import type { InviteFriendsProps } from "../interfaces";

export const inviteFriends = async ({
  slug,
  emails,
  message,
}: InviteFriendsProps) =>
  await ClaimsService.inviteFriends({ slug, emails, message });
