import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { Argument } from "./Argument";

export const Arguments: FC = ({
  title,
  arguments: argumentsList,
  isOpining,
}) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">{title}</Typography>
      <Stack spacing={2}>
        {argumentsList.map((argument) => (
          <Argument
            key={argument.id}
            argument={argument}
            isOpining={isOpining}
          />
        ))}
      </Stack>
    </Stack>
  );
};
