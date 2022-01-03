import { FC } from "react";
import {
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  GroupAdd as InviteFriendsIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

import type { ClaimProps } from "modules/claims/interfaces";
import type { TagProps } from "modules/tags/interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";

export const ClaimSummary: FC<{ claim: ClaimProps }> = ({ claim }) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        {claim?.title}
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={1}
      >
        <AuthorBlock
          user={claim?.user}
          createdAt={claim?.createdAt}
          size={40}
        />
        <Box flexGrow="1" />
        <Stack direction="row">
          <Tooltip title="Invite friends to participate in this claim">
            <IconButton>
              <InviteFriendsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Follow this claim to receive notifications whenever it is updated">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit claim">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete claim">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider></Divider>
      <Typography variant="body1">{claim?.summary}</Typography>
      <Stack direction="row" spacing={1}>
        {claim?.tags?.map(({ id, label }: TagProps) => (
          <Chip key={id} label={label} />
        ))}
      </Stack>
    </Stack>
  );
};
