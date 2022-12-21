import { FC, SyntheticEvent, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIconIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { find, get, isEmpty, map } from "lodash-es";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

import {
  AttributionOrigins,
  KnowledgeBitProps,
  KnowledgeBitTypes,
  KnowledgeBitTypesLabels,
  KnowledgeBitVoteTypes,
} from "modules/claims/interfaces";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import {
  KnowledgeBitUpsert,
  KnowledgeBitUpsertFormOperation,
} from "./KnowledgeBitUpsert";
import { Spinner } from "common/components/Spinner";
import { useKnowledgeBitsVotes } from "../hooks/useKnowledgeBitVotes";
import { useKnowledgeBits } from "../hooks/useKnowledgeBits";
import { useAuth } from "modules/auth/hooks/useAuth";
import { UserRole } from "modules/users/interfaces";
import {
  getFilenameFromIPFSURI,
  getGatewayFromIPFSURI,
} from "common/utils/ipfs";
import { Link } from "common/components/Link";
import { getAttributionLink } from "common/utils/attributions";
import { TransactionStepOperation } from "common/components/TransactionProgressModal";

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
  const { userKnowledgeBitVotes, saveKnowledgeBitVote, voteKnowledgeBitNFT } =
    useKnowledgeBitsVotes();
  const router = useRouter();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element>();
  const isMenuOpen = Boolean(menuAnchorEl);
  const [isDeleting, setIsDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { session, requireSignIn } = useAuth();

  const handleDetailsToggle = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };
  const handleMenuOpen = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event?: SyntheticEvent) => {
    event?.stopPropagation();
    setMenuAnchorEl(undefined);
  };
  const handleEdit = (event: SyntheticEvent) => {
    event.stopPropagation();
    setKnowledgeBitState(KnowledgeBitStates.UPDATING);
    handleMenuClose();
  };
  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation();
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
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setKnowledgeBitState(undefined);
      setIsDeleting(false);
    }
  };
  const handleDeleteDialogClose = () => setKnowledgeBitState(undefined);

  const handleVote = async (
    event: SyntheticEvent,
    type: KnowledgeBitVoteTypes
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setKnowledgeBitState(
      type === KnowledgeBitVoteTypes.UPVOTE
        ? KnowledgeBitStates.UPVOTING
        : KnowledgeBitStates.DOWNVOTING
    );

    const getVoteKnowledgeBitParameters = () => {
      if (
        (type === KnowledgeBitVoteTypes.UPVOTE &&
          get(userVote, "type") === KnowledgeBitVoteTypes.UPVOTE) ||
        (type === KnowledgeBitVoteTypes.DOWNVOTE &&
          get(userVote, "type") === KnowledgeBitVoteTypes.DOWNVOTE)
      ) {
        return {
          notificationsPrefix: `Unvote "${knowledgeBit.name}"`,
          voteType: KnowledgeBitVoteTypes.UNVOTE,
          voteTypeFn: "unvote",
        };
      } else if (type === KnowledgeBitVoteTypes.UPVOTE) {
        return {
          notificationsPrefix: `Upvote "${knowledgeBit.name}"`,
          voteType: KnowledgeBitVoteTypes.UPVOTE,
          voteTypeFn: "upvote",
        };
      } else {
        return {
          notificationsPrefix: `Downvote "${knowledgeBit.name}"`,
          voteType: KnowledgeBitVoteTypes.DOWNVOTE,
          voteTypeFn: "downvote",
        };
      }
    };
    const { notificationsPrefix, voteType, voteTypeFn } =
      getVoteKnowledgeBitParameters();

    try {
      enqueueSnackbar(
        `${notificationsPrefix}: ${TransactionStepOperation.SIGN}`,
        {
          variant: "info",
          autoHideDuration: 15000,
        }
      );

      const voteKnowledgeBitTx = await voteKnowledgeBitNFT({
        nftTokenId: knowledgeBit.nftTokenId,
        voteTypeFn,
      });

      enqueueSnackbar(
        `${notificationsPrefix}: ${TransactionStepOperation.WAIT_ONCHAIN}`,
        {
          variant: "info",
          autoHideDuration: 15000,
        }
      );

      await voteKnowledgeBitTx.wait();

      enqueueSnackbar(
        `${notificationsPrefix}: ${TransactionStepOperation.INDEX}`,
        {
          variant: "info",
        }
      );

      await saveKnowledgeBitVote({
        knowledgeBitId: knowledgeBit?.id as string,
        claimSlug: get(router.query, "slug") as string,
        voteType,
      });

      enqueueSnackbar(`${notificationsPrefix}: Success`, {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setKnowledgeBitState(undefined);
    }
  };
  const canManageKnowledgeBit =
    get(knowledgeBit, "user.id") === get(session, "user.id") ||
    get(session, "user.role") === UserRole.ADMIN;

  const userVote = find(
    userKnowledgeBitVotes,
    (userKnowledgeBitVote) =>
      get(userKnowledgeBitVote, "knowledgeBit.id") === knowledgeBit.id
  );

  return (
    <Box id={`knowledge-bit-${knowledgeBit?.id}`}>
      <Paper variant="outlined">
        <Stack
          direction="row"
          sx={{ p: { xs: 1, sm: 2 }, cursor: "pointer" }}
          onClick={handleDetailsToggle}
        >
          <Stack spacing={1} alignItems="flex-start" flexGrow={1}>
            <Typography variant="body1">{knowledgeBit?.name}</Typography>
            <div onClick={(event) => event.stopPropagation()}>
              <AvatarWithUsername user={knowledgeBit?.user} size={20} />
            </div>
          </Stack>
          <Stack justifyContent="center">
            {canManageKnowledgeBit ? (
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            ) : null}
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
            </Menu>
          </Stack>
          <Stack alignItems="center" justifyContent="center">
            <Tooltip
              title={
                get(userVote, "type") === KnowledgeBitVoteTypes.UPVOTE
                  ? "Unvote"
                  : "Upvote"
              }
            >
              <IconButton
                onClick={requireSignIn(
                  (ev) => handleVote(ev, KnowledgeBitVoteTypes.UPVOTE),
                  (ev) => ev.preventDefault()
                )}
                disabled={knowledgeBitState === KnowledgeBitStates.DOWNVOTING}
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
          <Stack alignItems="center" justifyContent="center">
            <Tooltip
              title={
                get(userVote, "type") === KnowledgeBitVoteTypes.DOWNVOTE
                  ? "Unvote"
                  : "Downvote"
              }
            >
              <IconButton
                onClick={requireSignIn(
                  (ev) => handleVote(ev, KnowledgeBitVoteTypes.DOWNVOTE),
                  (ev) => ev.preventDefault()
                )}
                disabled={knowledgeBitState === KnowledgeBitStates.UPVOTING}
              >
                {knowledgeBitState === KnowledgeBitStates.DOWNVOTING ? (
                  <CircularProgress size={24} />
                ) : get(userVote, "type") === KnowledgeBitVoteTypes.DOWNVOTE ? (
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

        {isDetailsOpen ? (
          <>
            <Divider />
            <Stack sx={{ bgcolor: grey[50], p: { xs: 1, sm: 2 } }} spacing={2}>
              <Stack spacing={3} direction="row">
                <Typography variant="body2">
                  Token ID:&nbsp;
                  <Link
                    href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/token/${process.env.NEXT_PUBLIC_KNOWLEDGE_BIT_CONTRACT_ADDRESS}?a=${knowledgeBit?.nftTokenId}`}
                    text
                    blank
                  >
                    {knowledgeBit?.nftTokenId}
                  </Link>
                </Typography>
                <Typography variant="body2">
                  Metadata:&nbsp;
                  <Link
                    href={getGatewayFromIPFSURI(knowledgeBit?.nftMetadataURI)}
                    text
                    blank
                  >
                    IPFS
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack sx={{ bgcolor: grey[50], p: { xs: 1, sm: 2 } }} spacing={2}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  Summary
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: knowledgeBit?.summary ? undefined : 100,
                    fontStyle: knowledgeBit?.summary ? "normal" : "italic",
                  }}
                >
                  {knowledgeBit?.summary || "Summary not provided"}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  Type
                </Typography>
                <Typography variant="body2">
                  {KnowledgeBitTypesLabels[knowledgeBit?.type]}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  File
                </Typography>
                <Typography variant="body2">
                  <Link
                    href={getGatewayFromIPFSURI(knowledgeBit?.fileURI)}
                    text
                    blank
                  >
                    {getFilenameFromIPFSURI(knowledgeBit?.fileURI)}
                  </Link>
                </Typography>
              </Stack>
              {isEmpty(knowledgeBit?.attributions) ? null : (
                <Stack spacing={1}>
                  <Typography variant="body2" fontWeight={600}>
                    Attributions
                  </Typography>

                  <ul style={{ margin: 0 }}>
                    {map(
                      knowledgeBit?.attributions,
                      ({ id, origin, identifier }) => (
                        <li key={id} style={{ marginBottom: "4px" }}>
                          <Typography variant="body2">
                            <Link
                              href={getAttributionLink({ origin, identifier })}
                              blank
                              text
                              supressBlankIcon
                            >
                              {identifier}
                            </Link>
                          </Typography>
                        </li>
                      )
                    )}
                  </ul>
                </Stack>
              )}
            </Stack>
          </>
        ) : null}

        {knowledgeBitState === KnowledgeBitStates.UPDATING ? (
          <>
            <Divider />
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
              <KnowledgeBitUpsert
                knowledgeBit={knowledgeBit}
                operation={KnowledgeBitUpsertFormOperation.UPDATE}
                handleClose={() => setKnowledgeBitState(undefined)}
              />
            </Box>
          </>
        ) : null}
      </Paper>

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
