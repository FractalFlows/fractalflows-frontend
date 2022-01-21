import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import type { UserProps } from "../interfaces";
import { AvatarWithUsername } from "./AvatarWithUsername";
import { formatDate } from "common/utils/format";
import { ClaimOrigins } from "modules/claims/interfaces";

interface AuthorBlockProps {
  user: UserProps;
  origin?: ClaimOrigins;
  createdAt?: Date;
  size?: number;
}

export const AuthorBlock: FC<AuthorBlockProps> = ({
  user,
  origin,
  createdAt,
  size,
}) => (
  <Stack direction="row" alignItems="center">
    <AvatarWithUsername user={user} size={size} />
    {origin && origin !== ClaimOrigins.FRACTALFLOWS ? (
      <Typography variant="body1">&nbsp;via {ClaimOrigins[origin]}</Typography>
    ) : null}
    {createdAt ? (
      <Typography variant="body2" color="textSecondary">
        &nbsp;&nbsp;&nbsp;{formatDate(createdAt)}
      </Typography>
    ) : null}
  </Stack>
);
