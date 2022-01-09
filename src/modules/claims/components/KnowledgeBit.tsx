import { FC, SyntheticEvent, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbUpAlt as ThumbUpAltIcon,
  ThumbDownOffAlt as ThumbDownOffAltIconIcon,
  ThumbDownAlt as ThumbDownAltIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { find, get } from "lodash-es";

import {
  KnowledgeBitProps,
  KnowledgeBitVoteTypes,
} from "modules/claims/interfaces";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import {
  KnowledgeBitUpsert,
  KnowledgeBitUpsertFormOperation,
} from "./KnowledgeBitUpsert";
import { Spinner } from "common/components/Spinner";
import { useSnackbar } from "notistack";
import { useKnowledgeBitsVotes } from "../hooks/useKnowledgeBitVotes";
import { useRouter } from "next/router";
import { useKnowledgeBits } from "../hooks/useKnowledgeBits";

enum KnowledgeBitStates {
  UPDATING,
  DELETING,
  UPVOTING,
  DOWNVOTING,
}

interface KnowledgeBitComponentProps {
  knowledgeBit: KnowledgeBitProps;
}

export const KnowledgeBit: FC<KnowledgeBitComponentProps> = ({
  knowledgeBit,
}) => {
  const [knowledgeBitState, setKnowledgeBitState] =
    useState<KnowledgeBitStates>();
  const { deleteKnowledgeBit } = useKnowledgeBits();
  const { userKnowledgeBitVotes, saveKnowledgeBitVote } =
    useKnowledgeBitsVotes();
  const router = useRouter();
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

  const handleVote = async (
    ev: SyntheticEvent,
    type: KnowledgeBitVoteTypes
  ) => {
    ev.preventDefault();

    setKnowledgeBitState(
      type === KnowledgeBitVoteTypes.UPVOTE
        ? KnowledgeBitStates.UPVOTING
        : KnowledgeBitStates.DOWNVOTING
    );

    try {
      await saveKnowledgeBitVote({
        knowledgeBitId: knowledgeBit?.id as string,
        claimSlug: get(router.query, "slug") as string,
        type,
      });
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setKnowledgeBitState(undefined);
    }
  };

  const userVote = find(
    userKnowledgeBitVotes,
    (userKnowledgeBitVote) =>
      get(userKnowledgeBitVote, "knowledgeBit.id") === knowledgeBit.id
  );

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
            <Stack alignItems="center">
              <Tooltip title="Upvote">
                <IconButton
                  onClick={(ev) => handleVote(ev, KnowledgeBitVoteTypes.UPVOTE)}
                >
                  {knowledgeBitState === KnowledgeBitStates.UPVOTING ? (
                    <CircularProgress size={24} />
                  ) : get(userVote, "type") === KnowledgeBitVoteTypes.UPVOTE ? (
                    <ThumbUpAltIcon />
                  ) : (
                    <ThumbUpOffAltIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Typography variant="caption">
                {knowledgeBit?.upvotesCount}
              </Typography>
            </Stack>
            <Stack alignItems="center">
              <Tooltip
                title="Downvote"
                onClick={(ev) => handleVote(ev, KnowledgeBitVoteTypes.DOWNVOTE)}
              >
                <IconButton>
                  {knowledgeBitState === KnowledgeBitStates.DOWNVOTING ? (
                    <CircularProgress size={24} />
                  ) : get(userVote, "type") ===
                    KnowledgeBitVoteTypes.DOWNVOTE ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIconIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Typography variant="caption">
                {knowledgeBit?.downvotesCount}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </a>
      {knowledgeBitState === KnowledgeBitStates.UPDATING ? (
        <Paper variant="outlined">
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
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
