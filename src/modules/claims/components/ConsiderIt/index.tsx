import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { ArgumentTypes } from "modules/claims/interfaces";
import { Histogram } from "./Histogram";
import { Arguments } from "./Arguments";
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
      id: 34,
      summary: "My argument",
      user,
      type: ArgumentTypes.CON,
      createdAt: new Date(),
      evidences: [],
      referrers: [user, user],
      comments: [],
    },
    {
      id: 36,
      summary: "My argument 2",
      user,
      type: ArgumentTypes.CON,
      createdAt: new Date(),
      evidences: [],
      referrers: [user],
      comments: [],
    },
    {
      id: 38,
      summary: "My argument3",
      user,
      type: ArgumentTypes.PRO,
      createdAt: new Date(),
      evidences: [],
      referrers: [user, user],
      comments: [],
    },
  ],
};

export const ConsiderIt = () => {
  const [isOpining, setIsOpining] = useState(false);
  const [showSingleOpinion, setShowSingleOpinion] = useState(false);
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

  const showOpinionFrom = (userId: string) => {
    setShowSingleOpinion(true);
  };

  const cons = discussion.arguments.filter(
    (argument) => argument.type === ArgumentTypes.CON
  );
  const pros = discussion.arguments.filter(
    (argument) => argument.type === ArgumentTypes.PRO
  );

  return (
    <Stack alignItems="center">
      <Stack sx={{ width: 700 }}>
        <Histogram
          isOpining={isOpining}
          setIsOpining={setIsOpining}
          opinions={discussion.opinions}
          showOpinionFrom={showOpinionFrom}
        />
        <Slider
          isOpining={isOpining}
          setIsOpining={setIsOpining}
          opinion={opinion}
          acceptance={acceptance}
          setAcceptance={setAcceptance}
        />
      </Stack>

      {showSingleOpinion ? (
        "Single opinion"
      ) : (
        <Stack direction="row" spacing={10}>
          <Arguments
            // addArgumentToSet={this._addArgumentToSet}
            type={ArgumentTypes.CON}
            arguments={cons}
            // pickedArguments={pickedCons}
            isOpining={isOpining}
          />
          <Arguments
            // addArgumentToSet={this._addArgumentToSet}
            type={ArgumentTypes.PRO}
            arguments={pros}
            // pickedArguments={pickedCons}
            isOpining={isOpining}
          />
        </Stack>
        // <SingleOpinion
        //   opinion={
        //     filter({ createdById: singleOpinionFromUserId }, opinions)[0]
        //   }
        //   cons={cons}
        //   pros={pros}
        //   hideSingleOpinion={this._hideSingleOpinion}
        // />
        // <OpinionContainer>
        //   <ListArguments
        //     addArgumentToSet={this._addArgumentToSet}
        //     type="con"
        //     argumentsList={cons}
        //     pickedArguments={pickedCons}
        //     givingOpinion={givingOpinion}
        //   />

        //   <GiveOpinion
        //     dragging={dragging}
        //     addArgumentToSet={this._addArgumentToSet}
        //     removeArgumentFromSet={this._removeArgumentFromSet}
        //     cons={cons}
        //     pros={pros}
        //     pickedCons={pickedCons}
        //     pickedPros={pickedPros}
        //     acceptance={acceptance}
        //     givingOpinion={givingOpinion}
        //     setGivingOpinionAs={this._setGivingOpinionAs}
        //     setHasOpinedAs={this._setHasOpinedAs}
        //     setUserAcceptance={this._setUserAcceptance}
        //   />

        //   <ListArguments
        //     addArgumentToSet={this._addArgumentToSet}
        //     type="pro"
        //     argumentsList={pros}
        //     pickedArguments={pickedPros}
        //     givingOpinion={givingOpinion}
        //   />
        // </OpinionContainer>
      )}
    </Stack>
  );
};