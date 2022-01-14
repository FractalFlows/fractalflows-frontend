import { FC, useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  GroupAdd as InviteFriendsIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  ReportProblem as DisableIcon,
} from "@mui/icons-material";
import {
  compact,
  concat,
  filter,
  find,
  get,
  isEmpty,
  map,
  remove,
} from "lodash-es";

import type { ClaimProps } from "modules/claims/interfaces";
import type { TagProps } from "modules/tags/interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { Link } from "common/components/Link";
import { deleteClaim } from "../hooks/delete";
import { useClaims } from "../hooks/useClaims";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";
import { InviteFriends } from "./InviteFriends";
import { useAuth } from "modules/auth/hooks/useAuth";
import { UserRole } from "modules/auth/interfaces";

export const ClaimSummary: FC<{ claim: ClaimProps }> = (props) => {
  const [claim, setClaim] = useState(props.claim);
  const { session, requireSignIn } = useAuth();
  const [isInviteFriendsDialogOpen, setIsInviteFriendsDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
  const {
    deleteClaim,
    disableClaim,
    addFollowerToClaim,
    removeFollowerFromClaim,
  } = useClaims();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteClaim({ id: claim?.id as string });
      setIsDeleteDialogOpen(false);
      enqueueSnackbar("Your claim has been sucesfully deleted!", {
        variant: "success",
      });
      router.push("/");
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDisableDialogClose = () => setIsDisableDialogOpen(false);
  const handleDisable = async () => {
    setIsDisabling(true);

    try {
      await disableClaim({ id: claim?.id as string });
      setIsDisableDialogOpen(false);
      enqueueSnackbar("This claim has been sucesfully disabled!", {
        variant: "success",
      });
      router.push("/");
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setIsDisabling(false);
    }
  };
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleInviteFriendsDialogClose = () =>
    setIsInviteFriendsDialogOpen(false);
  const handleFollow = async () => {
    setIsTogglingNotifications(true);

    try {
      await addFollowerToClaim({ id: claim?.id as string });
      enqueueSnackbar("The notifications have been sucesfully enabled!", {
        variant: "success",
      });
      const updatedClaim = {
        ...claim,
        followers: compact(concat(claim.followers, session.user)),
      };
      setClaim(updatedClaim);
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setIsTogglingNotifications(false);
    }
  };
  const handleUnfollow = async () => {
    setIsTogglingNotifications(true);

    try {
      await removeFollowerFromClaim({ id: claim?.id as string });
      enqueueSnackbar("The notifications have been sucesfully disabled!", {
        variant: "success",
      });
      const updatedClaim = {
        ...claim,
        followers: filter(
          claim.followers,
          ({ id }) => id !== get(session, "user.id")
        ),
      };
      setClaim(updatedClaim);
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setIsTogglingNotifications(false);
    }
  };

  const canManageClaim =
    get(claim, "user.id") === get(session, "user.id") ||
    get(session, "user.role") === UserRole.ADMIN;
  const isFollowing = find(
    get(claim, "followers"),
    ({ id }) => id === get(session, "user.id")
  );
  const getNotificationsContent = () => {
    if (isTogglingNotifications) {
      return (
        <IconButton>
          <CircularProgress size={24} />
        </IconButton>
      );
    } else if (isFollowing) {
      return (
        <Tooltip title="Stop following this claim" onClick={handleUnfollow}>
          <IconButton>
            <NotificationsOffIcon />
          </IconButton>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title="Follow this claim to receive notifications whenever it is updated"
          onClick={requireSignIn(handleFollow)}
        >
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      );
    }
  };

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
            <IconButton
              onClick={requireSignIn(() => setIsInviteFriendsDialogOpen(true))}
            >
              <InviteFriendsIcon />
            </IconButton>
          </Tooltip>
          <InviteFriends
            open={isInviteFriendsDialogOpen}
            handleClose={handleInviteFriendsDialogClose}
          />

          {getNotificationsContent()}

          {canManageClaim ? (
            <>
              <Link href={`/claim/${claim?.slug}/edit`}>
                <Tooltip title="Edit claim">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Delete claim">
                <IconButton onClick={() => setIsDeleteDialogOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : null}

          {get(session, "user.role") === UserRole.ADMIN ? (
            <Tooltip title="Disable this claim">
              <IconButton onClick={() => setIsDisableDialogOpen(true)}>
                <DisableIcon />
              </IconButton>
            </Tooltip>
          ) : null}

          {get(claim, "user.username") ===
          process.env.NEXT_PUBLIC_FRACTALFLOWS_BOT_USERNAME ? (
            <Link href={`/claim/${claim?.slug}/own`}>
              <Button variant="contained" sx={{ marginLeft: 2 }}>
                Own this claim
              </Button>
            </Link>
          ) : null}

          <Dialog
            open={isDisableDialogOpen}
            onClose={handleDisableDialogClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="disable-claim-dialog-title"
          >
            <DialogTitle id="disable-claim-dialog-title">
              Disable this claim?
            </DialogTitle>
            {isDisabling ? (
              <Spinner />
            ) : (
              <DialogActions>
                <Button onClick={handleDisableDialogClose}>Cancel</Button>
                <Button onClick={handleDisable} autoFocus>
                  Disable
                </Button>
              </DialogActions>
            )}
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onClose={handleDeleteDialogClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="delete-claim-dialog-title"
          >
            <DialogTitle id="delete-claim-dialog-title">
              Delete this claim?
            </DialogTitle>
            {isDeleting ? (
              <Spinner />
            ) : (
              <DialogActions>
                <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                <Button onClick={handleDelete} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            )}
          </Dialog>
        </Stack>
      </Stack>
      <Divider></Divider>
      <Typography variant="body1">{claim?.summary}</Typography>
      {isEmpty(claim?.tags) ? null : (
        <Stack direction="row" spacing={1}>
          {claim?.tags?.map(({ id, label }: TagProps) => (
            <Chip key={id} label={label} />
          ))}
        </Stack>
      )}
      {isEmpty(claim?.sources) ? null : (
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="body1" fontWeight="600">
            Sources
          </Typography>
          <ul>
            {map(claim?.sources, ({ id, url }) => (
              <li key={id}>
                <a href={url} rel="noreferrer" className="styled-link">
                  <Typography variant="body1" sx={{ display: "inline" }}>
                    {url}
                  </Typography>
                </a>
              </li>
            ))}
          </ul>
        </Stack>
      )}
    </Stack>
  );
};
