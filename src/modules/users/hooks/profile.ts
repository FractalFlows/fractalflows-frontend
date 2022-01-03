import { UsersService } from "../services/users";
import { GetProfileProps } from "../interfaces";

export const getProfile = async ({
  username,
  claimsRelation,
}: GetProfileProps) =>
  await UsersService.getProfile({ username, claimsRelation });
