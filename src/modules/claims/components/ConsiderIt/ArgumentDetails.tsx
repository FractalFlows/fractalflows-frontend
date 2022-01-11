import { FC, useEffect, useState } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import {
  compact,
  concat,
  filter,
  findIndex,
  get,
  isEmpty,
  map,
  sortBy,
} from "lodash-es";

import { ArgumentProps, ArgumentSides } from "modules/claims/interfaces";
import { useSnackbar } from "notistack";
import { useArguments } from "modules/claims/hooks/useArguments";
import { Spinner } from "common/components/Spinner";
import { NoResults } from "common/components/NoResults";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import { useAuth } from "modules/auth/hooks/useAuth";
import { ArgumentCommentUpsertForm } from "./ArgumentCommentUpsertForm";
import { UpsertFormOperation } from "common/interfaces";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";
import { ArgumentComment } from "./ArgumentComment";
import { Link } from "common/components/Link";

interface ArgumentDetailsProps {
  argumentId: string;
}

export const ArgumentDetails: FC<ArgumentDetailsProps> = ({ argumentId }) => {
  const { session, isSignedIn } = useAuth();
  const [argument, setArgument] = useState({} as ArgumentProps);
  const [isLoadingArgument, setIsLoadingArgument] = useState(true);
  const { getArgument } = useArguments();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddArgumentCommentSuccess = (
    argumentComment: ArgumentCommentProps
  ) => {
    const updatedArgument = {
      ...argument,
      comments: compact(concat(argument.comments, argumentComment)),
    };
    setArgument(updatedArgument);
  };
  const handleUpdateArgumentCommentSuccess = (
    argumentComment: ArgumentCommentProps
  ) => {
    const argumentCommentIndex = findIndex(argument.comments, {
      id: argumentComment.id,
    });
    const updatedArgument = Object.assign({}, argument);
    updatedArgument.comments.splice(argumentCommentIndex, 1, argumentComment);
    setArgument(updatedArgument);
  };
  const handleDeleteArgumentCommentSuccess = (
    deletedArgumentComment: ArgumentCommentProps
  ) => {
    const updatedArgumentComments = filter(
      argument.comments,
      (argumentComment) => argumentComment.id !== deletedArgumentComment.id
    );
    const updatedArgument = {
      ...argument,
      comments: updatedArgumentComments,
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
      <Stack spacing={2}>
        <Typography variant="h6">Discuss this point</Typography>
        <Stack spacing={3}>
          {map(sortBy(argument.comments, ["createdAt"]), (argumentComment) => (
            <ArgumentComment
              key={get(argumentComment, "id")}
              argumentComment={argumentComment}
              handleUpdate={handleUpdateArgumentCommentSuccess}
              handleDelete={handleDeleteArgumentCommentSuccess}
            />
          ))}
          {isSignedIn ? (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <AvatarWithUsername user={session.user} size={30} />
              <ArgumentCommentUpsertForm
                argumentComment={{ argument: { id: get(argument, "id") } }}
                handleSuccess={handleAddArgumentCommentSuccess}
                operation={UpsertFormOperation.CREATE}
              />
            </Stack>
          ) : (
            <Link href="/signin">
              <Button variant="contained">Sign in to participate</Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
