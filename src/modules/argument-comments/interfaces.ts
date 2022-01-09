import { ArgumentProps } from "modules/claims/interfaces";
import { UserProps } from "modules/users/interfaces";

export interface ArgumentCommentProps {
  id: string;
  content: string;
  user: UserProps;
  argument: ArgumentProps;
  createdAt: Date;
}
