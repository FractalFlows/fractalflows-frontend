import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { Histogram } from "./Histogram";
import { ArgumentColumn } from "./ArgumentColumn";
import { Slider } from "./Slider";
import { Opinion } from "./Opinion";
import { Opine } from "./Opine";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { useArguments } from "modules/claims/hooks/useArguments";

const user = {
  ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
  email: "yuri.fabris@gmail.com",
  username: "blocknomad.eth",
  usernameSource: "ENS",
  avatar: "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
  avatarSource: "GRAVATAR",
  __sidename: "User",
};

const argumentsList = [
  {
    id: 34,
    summary: "My argument",
    user,
    side: ArgumentSides.CON,
    createdAt: new Date(),
    evidences: [],
    referrers: [user, user],
    comments: [],
  },
  {
    id: 36,
    summary: "My argument 2",
    user,
    side: ArgumentSides.CON,
    createdAt: new Date(),
    evidences: [],
    referrers: [user],
    comments: [],
  },
  {
    id: 38,
    summary: "My argument3",
    user,
    side: ArgumentSides.PRO,
    createdAt: new Date(),
    evidences: [],
    referrers: [user, user],
    comments: [],
  },
];

const discussion = {
  opinions: [
    {
      id: 1,
      user,
      arguments: argumentsList,
      acceptance: 0.2,
    },
    {
      id: 2,
      user,
      arguments: argumentsList,
      acceptance: 0.2,
    },
    {
      id: 3,
      user,
      arguments: [argumentsList[0]],
      acceptance: 1,
    },
  ],
  arguments: argumentsList,
};

export const ConsiderIt = () => {
  const { isOpining, opinion, showOpinionId } = useOpinions();
  const { argumentsList } = useArguments();

  const filterArguments = (side: ArgumentSides) =>
    argumentsList.filter(
      (argument) =>
        argument.side === side &&
        (isOpining === false ||
          opinion.arguments.find(
            (opinionArgument) => argument.id === opinionArgument.id
          ) === undefined)
    );
  const cons = filterArguments(ArgumentSides.CON);
  const pros = filterArguments(ArgumentSides.PRO);

  return (
    <Stack alignItems="center">
      <Stack sx={{ width: 700 }}>
        <Histogram opinions={discussion.opinions} />
        <Slider />
      </Stack>

      {showOpinionId ? (
        <Opinion />
      ) : (
        <Stack direction="row" spacing={5}>
          <ArgumentColumn
            side={ArgumentSides.CON}
            title={`${isOpining ? "Others'" : "Top"} arguments against`}
            arguments={cons}
          />
          {isOpining ? <Opine /> : null}
          <ArgumentColumn
            side={ArgumentSides.PRO}
            title={`${isOpining ? "Others'" : "Top"} arguments for`}
            arguments={pros}
          />
        </Stack>
      )}
    </Stack>
  );
};
