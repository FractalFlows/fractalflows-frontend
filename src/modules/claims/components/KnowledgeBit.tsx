import { FC, SyntheticEvent, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
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
import { Spinner } from "common/components/Spinner";
import { useSnackbar } from "notistack";
import { useClaims } from "../hooks/useClaims";

enum KnowledgeBitStates {
  UPDATING,
  DELETING,
}

export const KnowledgeBit: FC<{ knowledgeBit: KnowledgeBitProps }> = ({
  knowledgeBit,
}) => {
  const { deleteKnowledgeBit } = useClaims();
  const [knowledgeBitState, setKnowledgeBitState] =
    useState<KnowledgeBitStates>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element>();
  const isMenuOpen = Boolean(menuAnchorEl);
  const [isDeleting, setIsDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuOpen = (event: SyntheticEvent) => {
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
  const handleDelete = () => {
    setKnowledgeBitState(KnowledgeBitStates.DELETING);
    handleMenuClose();
  };
  const handleDeleteConfirmation = async () => {
    handleMenuClose();
    setIsDeleting(true);

    try {
      await deleteKnowledgeBit({ id: knowledgeBit?.id as string });
      enqueueSnackbar("Your knowledge bit has been sucesfully deleted!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setKnowledgeBitState(undefined);
      setIsDeleting(false);
    }
  };
  const handleDeleteDialogClose = () => setKnowledgeBitState(undefined);

  return (
    <Box>
      <a href={knowledgeBit.url} target="_blank" rel="noreferrer">
        <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 } }}>
          <Stack direction="row">
            <Stack spacing={1} alignItems="flex-start" flexGrow={1}>
              <Typography variant="body1">{knowledgeBit?.name}</Typography>
              <AvatarWithUsername user={knowledgeBit?.user} size={20} />
            </Stack>
            <IconButton onClick={handleMenuOpen}>
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
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
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

      <Dialog
        open={knowledgeBitState === KnowledgeBitStates.DELETING}
        onClose={handleDeleteDialogClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-knowledge-bit-dialog-title"
      >
        <DialogTitle id="delete-knowledge-bit-dialog-title">
          Delete the <strong>{knowledgeBit?.name}</strong> knowledge bit?
        </DialogTitle>
        {isDeleting ? (
          <Spinner />
        ) : (
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirmation} autoFocus>
              Delete
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};
