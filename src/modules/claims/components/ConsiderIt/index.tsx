import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

import { Histogram } from "./Histogram";
import { Slider } from "./Slider";

const user = {
  ethAddress: "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6",
  email: "yuri.fabris@gmail.com",
  username: "blocknomad.eth",
  usernameSource: "ENS",
  avatar: "https://www.gravatar.com/avatar/49a046a0de6b525d1f41beab756cd89c",
  avatarSource: "GRAVATAR",
  __typename: "User",
};

const discussion = {
  opinions: [
    {
      id: 1,
      user,
      arguments: [],
      acceptance: 0.2,
    },
    {
      id: 2,
      user,
      arguments: [],
      acceptance: 0.2,
    },
    {
      id: 3,
      user,
      arguments: [],
      acceptance: 1,
    },
  ],
  arguments: [
    {
      summary: "My argument",
      user,
      type: "x",
      evidences: [],
      referrers: [],
      comments: [],
    },
  ],
};

export const ConsiderIt = () => {
  const [isOpining, setIsOpining] = useState(false);
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

  return (
    <Stack alignItems="center">
      <Stack sx={{ width: 700 }}>
        <Histogram
          isOpining={isOpining}
          setIsOpining={setIsOpining}
          opinions={discussion.opinions}
        />
        <Slider
          isOpining={isOpining}
          setIsOpining={setIsOpining}
          opinion={opinion}
          acceptance={acceptance}
          setAcceptance={setAcceptance}
        />
      </Stack>
    </Stack>
  );
};
