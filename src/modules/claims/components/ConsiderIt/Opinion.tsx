import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ArgumentSides, OpinionProps } from "modules/claims/interfaces";
import { ArgumentColumn } from "./ArgumentColumn";
import {
  getOpinion,
  setShowOpinionId,
  useOpinions,
} from "modules/claims/hooks/useOpinions";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";

const op = {
  id: 1,
  user: {
    ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
    email: "yuri.fabris@gmail.com",
    username: "blocknomad.eth",
    usernameSource: "ENS",
    avatar: "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
    avatarSource: "GRAVATAR",
    __sidename: "User",
  },
  arguments: [
    {
      id: 34,
      summary: "My argument",
      user: {
        ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
        email: "yuri.fabris@gmail.com",
        username: "blocknomad.eth",
        usernameSource: "ENS",
        avatar:
          "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
        avatarSource: "GRAVATAR",
        __sidename: "User",
      },
      side: ArgumentSides.CON,
      createdAt: new Date(),
      evidences: [],
      referrers: [
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __sidename: "User",
        },
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __sidename: "User",
        },
      ],
      comments: [],
    },
    {
      id: 36,
      summary: "My argument 2",
      user: {
        ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
        email: "yuri.fabris@gmail.com",
        username: "blocknomad.eth",
        usernameSource: "ENS",
        avatar:
          "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
        avatarSource: "GRAVATAR",
        __sidename: "User",
      },
      side: ArgumentSides.CON,
      createdAt: new Date(),
      evidences: [],
      referrers: [
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __sidename: "User",
        },
      ],
      comments: [],
    },
    {
      id: 38,
      summary: "My argument3",
      user: {
        ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
        email: "yuri.fabris@gmail.com",
        username: "blocknomad.eth",
        usernameSource: "ENS",
        avatar:
          "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
        avatarSource: "GRAVATAR",
        __sidename: "User",
      },
      side: ArgumentSides.PRO,
      createdAt: new Date(),
      evidences: [],
      referrers: [
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __sidename: "User",
        },
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __sidename: "User",
        },
      ],
      comments: [],
    },
  ],
  acceptance: -0.6,
};

export const Opinion = () => {
  const [opinion, setOpinion] = useState({} as OpinionProps);
  const [isLoadingOpinion, setIsLoadingOpinion] = useState(true);
  const { showOpinionId, setShowOpinionId } = useOpinions();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsLoadingOpinion(true);
    getOpinion({ id: showOpinionId })
      .then((data) => setOpinion(data))
      .catch((e) => enqueueSnackbar(e.message, { variant: "error" }))
      .finally(() => setIsLoadingOpinion(false));
  }, [showOpinionId]);

  const cons = opinion?.arguments?.filter(
    (argument) => argument.side === ArgumentSides.CON
  );
  const pros = opinion?.arguments?.filter(
    (argument) => argument.side === ArgumentSides.PRO
  );

  if (isLoadingOpinion) return <Spinner p={0} />;

  return (
    <Stack spacing={5}>
      <Typography variant="h4" align="center">
        <b>{opinion?.user?.username}</b>&apos;s opinion
      </Typography>

      <Stack direction="row" spacing={5}>
        <ArgumentColumn title="Cons" arguments={cons} />
        <ArgumentColumn title="Pros" arguments={pros} />
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowOpinionId(null)}
      >
        Back to results
      </Button>
    </Stack>
  );
};
