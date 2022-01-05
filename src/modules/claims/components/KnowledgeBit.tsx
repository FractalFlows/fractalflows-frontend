import { FC, SyntheticEvent, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDownOffAlt as ThumbDownOffAltIconIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import { KnowledgeBitProps } from "modules/claims/interfaces";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import {
  KnowledgeBitUpsert,
  KnowledgeBitUpsertFormOperation,
} from "./KnowledgeBitUpsert";

enum KnowledgeBitStates {
  UPDATING,
  DELETING,
}

export const KnowledgeBit: FC<{ knowledgeBit: KnowledgeBitProps }> = ({
  knowledgeBit,
}) => {
  const [knowledgeBitState, setKnowledgeBitState] =
    useState<KnowledgeBitStates>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element>();
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(undefined);
  };
  const handleEdit = () => {
    setKnowledgeBitState(KnowledgeBitStates.UPDATING);
    handleMenuClose();
  };

  return (
    <Box>
      <a href={knowledgeBit.url} target="_blank" rel="noreferrer">
        <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 } }}>
          <Stack direction="row">
            <Stack spacing={1} alignItems="flex-start" flexGrow={1}>
              <Typography variant="body1">{knowledgeBit?.name}</Typography>
              <AvatarWithUsername user={knowledgeBit?.user} size={20} />
            </Stack>
            <IconButton
              aria-label="more"
              id="long-button"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
            </Menu>
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
      {knowledgeBitState === KnowledgeBitStates.UPDATING ? (
        <Paper variant="outlined">
          <Box sx={{ p: 4 }}>
            <KnowledgeBitUpsert
              knowledgeBit={knowledgeBit}
              operation={KnowledgeBitUpsertFormOperation.UPDATE}
              handleClose={() => setKnowledgeBitState(undefined)}
            />
          </Box>
        </Paper>
      ) : null}
    </Box>
  );
};
