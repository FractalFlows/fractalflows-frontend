import { FC, useEffect, useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { compact, concat, get, isEmpty, map } from "lodash-es";

import { ArgumentProps, ArgumentSides } from "modules/claims/interfaces";
import { useSnackbar } from "notistack";
import { useArguments } from "modules/claims/hooks/useArguments";
import { Spinner } from "common/components/Spinner";
import { NoResults } from "common/components/NoResults";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import { useAuth } from "modules/auth/hooks/useAuth";
import { ArgumentCommentUpsertForm } from "./ArgumentCommentUpsertForm";
import { UpsertFormOperation } from "common/interfaces";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";

interface ArgumentDetailsProps {
  argumentId: string;
}

export const ArgumentDetails: FC<ArgumentDetailsProps> = ({ argumentId }) => {
  const { session, isSignedIn } = useAuth();
  const [argument, setArgument] = useState({} as ArgumentProps);
  const [isLoadingArgument, setIsLoadingArgument] = useState(true);
  const { getArgument } = useArguments();
  const { enqueueSnackbar } = useSnackbar();

  const addArgumentComment = (argumentComment: ArgumentCommentProps) => {
    const updatedArgument = {
      ...argument,
      comments: compact(concat(argument.comments, argumentComment)),
    };
    setArgument(updatedArgument);
  };

  useEffect(() => {
    setIsLoadingArgument(true);
    getArgument({ id: argumentId })
      .then((data) => setArgument(data))
      .catch((e) => enqueueSnackbar(e.message, { variant: "error" }))
      .finally(() => setIsLoadingArgument(false));
  }, [argumentId]);

  console.log(argument);

  if (isLoadingArgument) return <Spinner />;

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Evidences</Typography>

        <Stack direction="row" spacing={1}>
          {isEmpty(argument.evidences) ? (
            <NoResults p={0} align="left">
              No evidences
            </NoResults>
          ) : (
            map(argument.evidences, ({ id, name, url }) => (
              <a href={url} target="_blank" rel="noreferrer">
                <Chip key={id} label={name} />
              </a>
            ))
          )}
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">Discuss this point</Typography>
        <Stack spacing={3}>
          {map(argument.comments, ({ id, user, content, createdAt }) => (
            <Stack key={id} spacing={1}>
              <AuthorBlock user={user} createdAt={createdAt} size={20} />
              <Typography variant="body1">{content}</Typography>
            </Stack>
          ))}
          {isSignedIn ? (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <AvatarWithUsername user={session.user} size={20} />
              <ArgumentCommentUpsertForm
                argumentId={get(argument, "id")}
                handleSuccess={addArgumentComment}
                operation={UpsertFormOperation.CREATE}
              />
            </Stack>
          ) : (
            "Login"
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
