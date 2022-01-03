import AccountCircle from "@mui/icons-material/AccountCircle";
import { Avatar, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { Link } from "common/components/Link";
import type { UserProps } from "../interfaces";
import { AvatarWithUsername } from "./AvatarWithUsername";
import { formatDate } from "common/utils/format";

interface AuthorBlockProps {
  user: UserProps;
  createdAt?: Date;
  size?: number;
}

export const AuthorBlock: FC<AuthorBlockProps> = ({
  user,
  createdAt,
  size,
}) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <AvatarWithUsername user={user} size={size} />
    {createdAt ? (
      <Typography variant="body2" color="textSecondary">
        {formatDate(createdAt)}
      </Typography>
    ) : null}
  </Stack>
);
