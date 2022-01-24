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
  <Stack
    direction={{ xs: "column", sm: "row" }}
    alignItems={{ xs: "left", sm: "center" }}
    spacing={{ xs: 0, sm: 1 }}
  >
    <AvatarWithUsername user={user} size={size} />
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ paddingLeft: { xs: `${size + 8}px`, sm: 0 } }}
    >
      {origin && origin !== ClaimOrigins.FRACTALFLOWS ? (
        <Typography variant="body1">via {ClaimOrigins[origin]}</Typography>
      ) : null}
      {createdAt ? (
        <Typography variant="body2" color="textSecondary">
          {formatDate(createdAt)}
        </Typography>
      ) : null}
    </Stack>
  </Stack>
);
