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
import { find } from "lodash-es";

export const ConsiderIt = () => {
  const { isOpining, userOpinion, opinions, showOpinionId } = useOpinions();
  const { argumentsList } = useArguments();

  const filterArguments = (side: ArgumentSides) =>
    argumentsList.filter(
      (argument) =>
        argument.side === side &&
        (isOpining === false ||
          find(userOpinion?.arguments, { id: argument.id }) === undefined)
    );
  const cons = filterArguments(ArgumentSides.CON);
  const pros = filterArguments(ArgumentSides.PRO);

  return (
    <Stack alignItems="center">
      <Stack sx={{ width: 700 }}>
        <Histogram opinions={opinions} />
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
