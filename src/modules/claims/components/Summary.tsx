import { FC, useEffect, useState } from "react";
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
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InviteFriendsIcon from "@mui/icons-material/GroupAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import DisableIcon from "@mui/icons-material/ReportProblem";

import { compact, concat, filter, find, get, isEmpty, map } from "lodash-es";

import type { TagProps } from "modules/tags/interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { Link } from "common/components/Link";
import { useClaims } from "../hooks/useClaims";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";
import { InviteFriends } from "./InviteFriends";
import { useAuth } from "modules/auth/hooks/useAuth";
import { UserRole } from "modules/auth/interfaces";
import { ConnectTwitter } from "common/components/ConnectTwitter";
import styles from "./Summary.module.css";
import { LoadingButton } from "@mui/lab";
import { ClaimNFTStatusBar } from "./ClaimNFTStatusBar";

enum ClaimCallbackOperations {
  REQUEST_OWNERSHIP = "REQUEST_OWNERSHIP",
}

export const ClaimSummary: FC = (props) => {
  const { session, requireSignIn } = useAuth();
  const {
    claim,
    setClaim,
    requestClaimOwnership,
    reenableClaim,
    deleteClaim,
    disableClaim,
    addFollowerToClaim,
    removeFollowerFromClaim,
  } = useClaims();
  const [isInviteFriendsDialogOpen, setIsInviteFriendsDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [isRequestingOwnership, setIsRequestingOwnership] = useState(false);
  const [
    isConnectTwitterAccountDialogOpen,
    setIsConnectTwitterAccountDialogOpen,
  ] = useState(false);
  const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);
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
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleDisable = async () => {
    setIsDisabling(true);

    try {
      await disableClaim({ id: claim?.id as string });
      setIsDisableDialogOpen(false);
      enqueueSnackbar("This claim has been sucesfully disabled!", {
        variant: "success",
      });
      router.push("/");
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsDisabling(false);
    }
  };
  const handleDisableDialogClose = () => setIsDisableDialogOpen(false);
  const handleInviteFriendsDialogClose = () =>
    setIsInviteFriendsDialogOpen(false);
  const handleFollow = async () => {
    setIsTogglingNotifications(true);

    try {
      await addFollowerToClaim({ id: claim?.id as string });
      enqueueSnackbar("Notifications have been sucesfully enabled!", {
        variant: "success",
      });
      const updatedClaim = {
        ...claim,
        followers: compact(concat(claim.followers, session.user)),
      };
      setClaim(updatedClaim);
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
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
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsTogglingNotifications(false);
    }
  };

  const handleRequestOwnership = async () => {
    setIsRequestingOwnership(true);

    if (isEmpty(get(session, "user.twitter"))) {
      setIsConnectTwitterAccountDialogOpen(true);
    } else {
      try {
        await requestClaimOwnership({ id: claim.id });
        enqueueSnackbar("Your are now the owner of this claim!", {
          variant: "success",
        });
      } catch (e: any) {
        enqueueSnackbar(e?.message || e, { variant: "error" });
      } finally {
        setIsRequestingOwnership(false);
      }
    }
  };
  const handleConnectTwitterAccountDialogClose = () => {
    setIsConnectTwitterAccountDialogOpen(false);
    setIsRequestingOwnership(false);
  };

  const canManageClaim =
    get(claim, "user.id") === get(session, "user.id") ||
    get(session, "user.role") === UserRole.ADMIN;
  const canRequestOwnership =
    isEmpty(get(session, "user.twitter")) ||
    get(claim, "tweetOwner") === get(session, "user.twitter");
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

  useEffect(() => {
    if (router.isReady && claim?.id && router.query.callbackOperation) {
      if (
        router.query.callbackOperation ===
        ClaimCallbackOperations.REQUEST_OWNERSHIP
      ) {
        handleRequestOwnership();
      }

      router.replace(window.location.pathname, undefined, { shallow: true });
    }
  }, [router.isReady, claim?.id]);

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
          origin={claim?.origin}
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
            <Tooltip
              title={
                canRequestOwnership === false
                  ? `Only the original tweet owner, @${get(
                      claim,
                      "tweetOwner"
                    )}, can request ownership over this claim`
                  : ""
              }
            >
              {/* This extra div is necessary to make the pointer-events work and active the tooltip when the button is disabled */}
              <div>
                <LoadingButton
                  variant="contained"
                  sx={{ marginLeft: 2 }}
                  loading={isRequestingOwnership}
                  onClick={requireSignIn(handleRequestOwnership)}
                  disabled={canRequestOwnership === false}
                >
                  Request ownership
                </LoadingButton>
              </div>
            </Tooltip>
          ) : null}

          <Dialog
            open={isConnectTwitterAccountDialogOpen}
            onClose={handleConnectTwitterAccountDialogClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="connect-twitter-account-dialog-title"
          >
            <DialogTitle id="connect-twitter-account-dialog-title">
              Connect your Twitter account
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography variant="body1">
                  In order to request ownership over this claim, you&apos;ll
                  need to connect your Twitter account to prove you are the
                  original tweet owner,{" "}
                  <strong>@{get(claim, "tweetOwner")}</strong>.
                </Typography>
                <ConnectTwitter
                  callbackOperation={ClaimCallbackOperations.REQUEST_OWNERSHIP}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConnectTwitterAccountDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

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
      <Divider />
      <ClaimNFTStatusBar />
      <Divider />
      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {claim?.summary}
      </Typography>
      {isEmpty(claim?.tags) ? null : (
        <Stack direction="row" spacing={1}>
          {claim?.tags?.map(({ id, label, slug }: TagProps) => (
            <Link href={`/tag/${slug}`} key={id}>
              <Chip label={label} />
            </Link>
          ))}
        </Stack>
      )}
      {isEmpty(claim?.sources) ? null : (
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="body1" fontWeight="600">
            Sources
          </Typography>
          <ul className={styles.sources}>
            {map(claim?.sources, ({ id, url }) => (
              <li key={id}>
                <a
                  href={url}
                  rel="noreferrer"
                  className="styled-link"
                  target="_blank"
                >
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
