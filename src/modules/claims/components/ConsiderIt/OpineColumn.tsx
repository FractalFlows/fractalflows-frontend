import { Button, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

import { ArgumentSides } from "modules/claims/interfaces";
import { Argument } from "./Argument";
import { ArgumentUpsertForm } from "./ArgumentUpsertForm";
import { useState } from "react";
import { UpsertFormOperation } from "common/interfaces";
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

export const OpineColumn = ({ side }) => {
  const { pickedArguments } = useArguments();
  const [isAddingArgument, setIsAddingArgument] = useState(false);

  const filteredPickedArgumments = pickedArguments.filter(
    (pickedArgument) => pickedArgument.side === side
  );

  return (
    <Stack sx={{ width: "50%" }} spacing={3}>
      <Typography variant="h5">
        Give your arguments {OpineColumnTexts[side].columnTitle}
      </Typography>
      <Stack spacing={1}>
        {filteredPickedArgumments.map((pickedArgument) => (
          <Argument
            key={pickedArgument.id}
            argument={pickedArgument}
            hideReferrers
          />
        ))}
      </Stack>
      <Typography variant="body1">
        Drag an <b>argument {OpineColumnTexts[side].columnTitle}</b> from the{" "}
        {OpineColumnTexts[side].columnSide} or
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
