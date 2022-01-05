import { FC } from "react";
import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import {
  Edit as EditIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDownOffAlt as ThumbDownOffAltIconIcon,
} from "@mui/icons-material";

import { KnowledgeBitProps } from "modules/claims/interfaces";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";

export const KnowledgeBit: FC<{ knowledgeBit: KnowledgeBitProps }> = ({
  knowledgeBit,
}) => {
  return (
    <a href={knowledgeBit.url} target="_blank" rel="noreferrer">
      <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 } }}>
        <Stack direction="row">
          <Stack spacing={1} alignItems="flex-start" flexGrow={1}>
            <Typography variant="body1">{knowledgeBit?.name}</Typography>
            <AvatarWithUsername user={knowledgeBit?.user} size={20} />
          </Stack>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Upvote">
            <IconButton>
              <ThumbUpOffAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Downvote">
            <IconButton>
              <ThumbDownOffAltIconIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </a>
  );
};
