import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ArgumentTypes } from "modules/claims/interfaces";
import { Arguments } from "./Arguments";

const op = {
  id: 1,
  user: {
    ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
    email: "yuri.fabris@gmail.com",
    username: "blocknomad.eth",
    usernameSource: "ENS",
    avatar: "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
    avatarSource: "GRAVATAR",
    __typename: "User",
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
        __typename: "User",
      },
      type: ArgumentTypes.CON,
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
          __typename: "User",
        },
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __typename: "User",
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
        __typename: "User",
      },
      type: ArgumentTypes.CON,
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
          __typename: "User",
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
        __typename: "User",
      },
      type: ArgumentTypes.PRO,
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
          __typename: "User",
        },
        {
          ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
          email: "yuri.fabris@gmail.com",
          username: "blocknomad.eth",
          usernameSource: "ENS",
          avatar:
            "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
          avatarSource: "GRAVATAR",
          __typename: "User",
        },
      ],
      comments: [],
    },
  ],
  acceptance: -0.6,
};

export const Opinion = ({ opinionId, handleHideOpinion }) => {
  const [opinion, setOpinion] = useState(op);
  const cons = opinion.arguments.filter(
    (argument) => argument.type === ArgumentTypes.CON
  );
  const pros = opinion.arguments.filter(
    (argument) => argument.type === ArgumentTypes.PRO
  );

  return (
    <Stack spacing={5}>
      <Typography variant="h4" align="center">
        <b>{opinion.user.username}</b>&apos;s opinion
      </Typography>

      <Stack direction="row" spacing={10}>
        <Arguments title="Cons" arguments={cons} />
        <Arguments title="Pros" arguments={pros} />
      </Stack>
      <Button variant="contained" color="secondary" onClick={handleHideOpinion}>
        Back to results
      </Button>
    </Stack>
  );
};
