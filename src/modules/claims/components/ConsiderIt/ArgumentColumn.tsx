import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { Argument } from "./Argument";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useOpinions } from "modules/claims/hooks/useOpinions";

export const ArgumentColumn: FC = ({ title, arguments: argumentsList }) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">{title}</Typography>
      <Stack spacing={2} sx={{ width: 330 }}>
        {argumentsList.map((argument) => (
          <Argument key={argument.id} argument={argument} />
        ))}
      </Stack>
    </Stack>
  );
};
