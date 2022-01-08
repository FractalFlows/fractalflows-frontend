import { FC, useEffect, useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { isEmpty, map } from "lodash-es";

import { ArgumentProps, ArgumentSides } from "modules/claims/interfaces";
import { useSnackbar } from "notistack";
import { useArguments } from "modules/claims/hooks/useArguments";
import { Spinner } from "common/components/Spinner";
import { NoResults } from "common/components/NoResults";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import { useAuth } from "modules/auth/hooks/useAuth";
import { ArgumentCommentUpsertForm } from "./ArgumentCommentUpsertForm";

interface ArgumentDetailsProps {
  argumentId: string;
}

export const ArgumentDetails: FC<ArgumentDetailsProps> = ({ argumentId }) => {
  const { session, isSignedIn } = useAuth();
  const [argument, setArgument] = useState({} as ArgumentProps);
  const [isLoadingArgument, setIsLoadingArgument] = useState(true);
  const { getArgument } = useArguments();
  const { enqueueSnackbar } = useSnackbar();

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
    <Stack spacing={3} sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="body1" fontWeight="bold">
          Evidences
        </Typography>

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
      <Stack spacing={3}>
        <Typography variant="body1" fontWeight="bold">
          Discuss this point
        </Typography>
        <Stack direction="row" spacing={1}>
          {map(argument.comments, ({ id, user, createdAt }) => (
            <Stack key={id}>
              <AuthorBlock user={user} createdAt={createdAt} size={20} />
            </Stack>
          ))}
          {isSignedIn ? (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <AvatarWithUsername user={session.user} size={20} />
              <ArgumentCommentUpsertForm />
            </Stack>
          ) : (
            "Login"
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
