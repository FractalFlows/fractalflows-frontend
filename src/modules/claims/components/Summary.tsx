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
import { Link } from "common/components/Link";
import { deleteClaim } from "../hooks/delete";
import { useClaims } from "../hooks/useClaims";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";
import { InviteFriends } from "./InviteFriends";

export const ClaimSummary: FC<{ claim: ClaimProps }> = ({ claim }) => {
  const [isInviteFriendsDialogOpen, setIsInviteFriendsDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteClaim } = useClaims();
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
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleInviteFriendsDialogClose = () =>
    setIsInviteFriendsDialogOpen(false);

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
            <IconButton onClick={() => setIsInviteFriendsDialogOpen(true)}>
              <InviteFriendsIcon />
            </IconButton>
          </Tooltip>
          <InviteFriends
            open={isInviteFriendsDialogOpen}
            handleClose={handleInviteFriendsDialogClose}
          />
          <Tooltip title="Follow this claim to receive notifications whenever it is updated">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

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
      <Stack direction="row" spacing={1}>
        {claim?.tags?.map(({ id, label }: TagProps) => (
          <Chip key={id} label={label} />
        ))}
      </Stack>
    </Stack>
  );
};
