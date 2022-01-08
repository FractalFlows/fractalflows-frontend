import { Button, Stack, Typography } from "@mui/material";
import { UpsertFormOperation } from "common/interfaces";
import { get } from "lodash-es";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";
import { useAuth } from "modules/auth/hooks/useAuth";

import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { FC, useState } from "react";
import { ArgumentCommentUpsertForm } from "./ArgumentCommentUpsertForm";

enum ArgumentCommentStates {
  UPDATING,
  DELETING,
}

interface ArgumentCommentComponentProps {
  argumentComment: ArgumentCommentProps;
  handleUpdate: (prop: ArgumentCommentProps) => any;
}

export const ArgumentComment: FC<ArgumentCommentComponentProps> = ({
  argumentComment,
  handleUpdate,
}) => {
  const { session, isSignedIn } = useAuth();
  const [argumentCommentState, setArgumentCommentState] =
    useState<ArgumentCommentStates>();

  const canManageArgumentComment = (userId: string) =>
    isSignedIn && userId === get(session, "user.id");

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
          {canManageArgumentComment(get(argumentComment, "user.id")) ? (
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
              <Button size="small" className="MuiButton--nopadding">
                Remove
              </Button>
            </Stack>
          ) : null}
        </>
      )}
    </Stack>
  );
};
