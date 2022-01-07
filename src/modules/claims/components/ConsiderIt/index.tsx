import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { Histogram } from "./Histogram";
import { ArgumentColumn } from "./ArgumentColumn";
import { Slider } from "./Slider";
import { Opinion } from "./Opinion";
import { Opine } from "./Opine";
import { useOpinion } from "modules/claims/hooks/useOpinion";

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
  const { isOpining } = useOpinion();
  const [showOpinion, setShowOpinion] = useState(false);
  const [opinion, setOpinion] = useState("Slide Your Overall Opinion");
  const [acceptance, setAcceptance] = useState(0.5);

  useEffect(() => {
    if (acceptance < 0.01) {
      setOpinion("You Fully Disagree");
    } else if (acceptance < 0.23) {
      setOpinion("You Firmly Disagree");
    } else if (acceptance < 0.45) {
      setOpinion("You Slightly Disagree");
    } else if (acceptance < 0.55) {
      setOpinion("You Are Undecided");
    } else if (acceptance < 0.77) {
      setOpinion("You Slightly Agree");
    } else if (acceptance < 0.99) {
      setOpinion("You Firmly Agree");
    } else {
      setOpinion("You Fully Agree");
    }
  }, [acceptance]);

  const handleShowOpinion = (userId: string) => {
    setShowOpinion(true);
  };
  const handleHideOpinion = () => {
    setShowOpinion(false);
  };

  useEffect(() => {
    if (isOpining) {
      setShowOpinion(false);
    }
  }, [isOpining]);

  return (
    <Stack alignItems="center">
      <Stack sx={{ width: 700 }}>
        <Histogram
          opinions={discussion.opinions}
          handleShowOpinion={handleShowOpinion}
        />
        <Slider
          opinion={opinion}
          acceptance={acceptance}
          setAcceptance={setAcceptance}
        />
      </Stack>

      {showOpinion ? (
        <Opinion
          opinion={discussion.opinions[0]}
          handleHideOpinion={handleHideOpinion}
        />
      ) : (
        <Stack direction="row" spacing={5}>
          <ArgumentColumn
            side={ArgumentSides.CON}
            title={`${isOpining ? "Others'" : "Top"} arguments against`}
          />
          {isOpining ? <Opine acceptance={acceptance} /> : null}
          <ArgumentColumn
            side={ArgumentSides.PRO}
            title={`${isOpining ? "Others'" : "Top"} arguments for`}
          />
        </Stack>
      )}
    </Stack>
  );
};
