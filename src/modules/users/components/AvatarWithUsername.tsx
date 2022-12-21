import AccountCircle from "@mui/icons-material/AccountCircle";
import { Avatar, Chip, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { Link } from "common/components/Link";
import type { UserProps } from "../interfaces";

interface AvatarProps {
  user: UserProps;
  size?: number;
}

export const AvatarWithUsername: FC<AvatarProps> = ({ user, size = 40 }) => (
  <Link href={`/user/${user?.username}/claims`}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar
        src={user?.avatar}
        sx={{
          width: size,
          height: size,
        }}
      >
        <AccountCircle sx={{ fontSize: size }} />
      </Avatar>
      <Typography
        variant="body1"
        fontWeight="600"
        noWrap
        sx={{ maxWidth: 150 }}
      >
        {user?.username}{" "}
        {user?.username === "fractalflowsbot" ? (
          <Chip size="small" label="BOT" sx={{ fontWeight: "normal" }} />
        ) : null}
      </Typography>
    </Stack>
  </Link>
);
