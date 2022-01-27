import type { FC } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { Argument, ArgumentPlacements } from "./Argument";
import { ArgumentUpsertForm } from "./ArgumentUpsertForm";
import { useState } from "react";
import { UpsertFormOperation } from "common/interfaces";
import { find, isEmpty } from "lodash-es";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { useArguments } from "modules/claims/hooks/useArguments";

const OpineColumnTexts = {
  [ArgumentSides.CON]: {
    columnTitle: "against",
    columnSide: "left",
    submitButton: "Host claim",
    successFeedback: "Your new claim haeen succesfully added!",
  },
  [ArgumentSides.PRO]: {
    columnTitle: "for",
    columnSide: "right",
    submitButton: "Edit claim",
    successFeedback: "Your claim has been succesfully edited!",
  },
};

interface OpineColumnProps {
  side: ArgumentSides;
}

export const OpineColumn: FC<OpineColumnProps> = ({ side }) => {
  const { userOpinion } = useOpinions();
  const [isAddingArgument, setIsAddingArgument] = useState(false);
  const { argumentsList } = useArguments();

  const filteredArguments = argumentsList.filter(
    (argument) =>
      argument.side === side &&
      find(userOpinion?.arguments, { id: argument.id }) !== undefined
  );

  return (
    <Stack sx={{ width: "100%" }} spacing={3}>
      {isEmpty(filteredArguments) ? null : (
        <Stack spacing={1}>
          {filteredArguments.map((argument) => (
            <Argument
              key={argument.id}
              argument={argument}
              placement={ArgumentPlacements.OPINION}
            />
          ))}
        </Stack>
      )}
      <Typography variant="body1">
        Drag an argument from the {OpineColumnTexts[side].columnSide} or
      </Typography>
      {isAddingArgument ? (
        <ArgumentUpsertForm
          argument={{ side }}
          operation={UpsertFormOperation.CREATE}
          handleClose={() => setIsAddingArgument(false)}
        />
      ) : (
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 1 }}
          onClick={() => setIsAddingArgument(true)}
        >
          Write a new argument {OpineColumnTexts[side].columnTitle}
        </Button>
      )}
    </Stack>
  );
};
