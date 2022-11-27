import { FC, useEffect, useState } from "react";
import { Button, Chip, Divider, Stack, Typography } from "@mui/material";
import {
  compact,
  concat,
  filter,
  findIndex,
  get,
  isEmpty,
  map,
  pick,
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
import { useApp } from "modules/app/useApp";
import { Link } from "common/components/Link";
import { getGatewayFromIPFSURI } from "common/utils/ipfs";

interface ArgumentDetailsProps {
  argumentId: string;
}

export const ArgumentDetails: FC<ArgumentDetailsProps> = ({
  argumentId,
  handleClose,
}) => {
  const { session, isSignedIn } = useAuth();
  const { setIsSignInDialogOpen } = useApp();
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
      .catch((e: any) => enqueueSnackbar(e?.message, { variant: "error" }))
      .finally(() => setIsLoadingArgument(false));
  }, [argumentId]);

  if (isLoadingArgument) return <Spinner />;

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Argument</Typography>
        <Typography variant="body1">{argument.summary}</Typography>

        <Divider />

        <Stack spacing={3} direction="row">
          <Typography variant="body2">
            Token ID:&nbsp;
            <Link
              href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/token/${process.env.NEXT_PUBLIC_ARGUMENT_CONTRACT_ADDRESS}?a=${argument?.nftTokenId}`}
              text
              blank
            >
              {argument?.nftTokenId}
            </Link>
          </Typography>
          <Typography variant="body2">
            Metadata:&nbsp;
            <Link
              href={getGatewayFromIPFSURI(argument?.nftMetadataURI)}
              text
              blank
            >
              IPFS
            </Link>
          </Typography>
        </Stack>

        <Divider />

        <Typography variant="h6">Evidences</Typography>

        <Stack direction="row" spacing={1}>
          {isEmpty(argument.evidences) ? (
            <NoResults p={0} align="left">
              No evidences
            </NoResults>
          ) : (
            map(argument.evidences, ({ id, name }) => (
              <Chip
                key={id}
                label={name}
                onClick={() => {
                  setTimeout(() => {
                    document
                      .getElementById(`knowledge-bit-${id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 0);
                  handleClose();
                }}
              />
            ))
          )}
        </Stack>
      </Stack>

      <Divider />

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
                argumentComment={{
                  argument: pick(argument, ["id", "nftTokenId"]),
                }}
                handleSuccess={handleAddArgumentCommentSuccess}
                operation={UpsertFormOperation.CREATE}
              />
            </Stack>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsSignInDialogOpen(true)}
              sx={{ alignSelf: "flex-start" }}
            >
              Sign in to participate
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
