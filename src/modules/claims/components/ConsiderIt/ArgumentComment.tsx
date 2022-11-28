import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Spinner } from "common/components/Spinner";
import { UpsertFormOperation } from "common/interfaces";
import { get } from "lodash-es";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";
import { useArgumentComments } from "modules/argument-comments/useArgumentComments";
import { useAuth } from "modules/auth/hooks/useAuth";

import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { UserRole } from "modules/users/interfaces";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { ArgumentCommentUpsertForm } from "./ArgumentCommentUpsertForm";

enum ArgumentCommentStates {
  UPDATING,
  DELETING,
}

interface ArgumentCommentComponentProps {
  argumentComment: ArgumentCommentProps;
  handleUpdate: (prop: ArgumentCommentProps) => any;
  handleDelete: (prop: ArgumentCommentProps) => any;
}

export const ArgumentComment: FC<ArgumentCommentComponentProps> = ({
  argumentComment,
  handleUpdate,
  handleDelete,
}) => {
  const { session, isSignedIn } = useAuth();
  const { deleteArgumentComment } = useArgumentComments();
  const [isDeleting, setIsDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [argumentCommentState, setArgumentCommentState] =
    useState<ArgumentCommentStates>();

  const canManageArgumentComment = (userId: string) =>
    (isSignedIn && userId === get(session, "user.id")) ||
    get(session, "user.role") === UserRole.ADMIN;

  const handleDeleteDialogClose = () => setArgumentCommentState(undefined);
  const handleDeleteDialogConfirmation = async () => {
    setIsDeleting(true);

    try {
      await deleteArgumentComment({ argumentComment });
      enqueueSnackbar("Your comment has been sucesfully deleted!", {
        variant: "success",
      });
      handleDelete && handleDelete(argumentComment);
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack spacing={1}>
      <AuthorBlock
        user={get(argumentComment, "user")}
        createdAt={get(argumentComment, "createdAt")}
        size={25}
      />
      {argumentCommentState === ArgumentCommentStates.UPDATING ? (
        <ArgumentCommentUpsertForm
          argumentComment={argumentComment}
          handleSuccess={handleUpdate}
          handleClose={() => setArgumentCommentState(undefined)}
          operation={UpsertFormOperation.UPDATE}
        />
      ) : (
        <>
          <Typography variant="body1">
            {get(argumentComment, "content")}
          </Typography>
          {/* {canManageArgumentComment(get(argumentComment, "user.id")) ? (
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                className="MuiButton--nopadding"
                onClick={() =>
                  setArgumentCommentState(ArgumentCommentStates.UPDATING)
                }
              >
                Edit
              </Button>
              <Button
                size="small"
                className="MuiButton--nopadding"
                onClick={() =>
                  setArgumentCommentState(ArgumentCommentStates.DELETING)
                }
              >
                Remove
              </Button>
            </Stack> 
          ) : null}*/}
        </>
      )}
      <Dialog
        open={argumentCommentState === ArgumentCommentStates.DELETING}
        onClose={handleDeleteDialogClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-argument-comment-dialog-title"
      >
        <DialogTitle id="delete-argument-comment-dialog-title">
          Delete this comment?
        </DialogTitle>
        {isDeleting ? (
          <Spinner />
        ) : (
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={handleDeleteDialogConfirmation} autoFocus>
              Delete
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Stack>
  );
};
