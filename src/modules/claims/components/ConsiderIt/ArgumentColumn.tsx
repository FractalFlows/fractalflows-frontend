import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { Argument } from "./Argument";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useOpinion } from "modules/claims/hooks/useOpinion";

export const ArgumentColumn: FC = ({ title, side }) => {
  const { argumentsList, pickedArguments } = useArguments();
  const { isOpining } = useOpinion();

  const filteredArgumentsList = isOpining
    ? argumentsList.filter(
        (argument) =>
          argument.side === side &&
          pickedArguments.find(
            (pickedArgument) => argument.id === pickedArgument.id
          ) === undefined
      )
    : argumentsList.filter((argument) => argument.side === side);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{title}</Typography>
      <Stack spacing={2} sx={{ width: 330 }}>
        {filteredArgumentsList.map((argument) => (
          <Argument key={argument.id} argument={argument} />
        ))}
      </Stack>
    </Stack>
  );
};
