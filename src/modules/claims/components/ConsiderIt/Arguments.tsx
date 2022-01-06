import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { ArgumentTypes } from "modules/claims/interfaces";
import { Argument } from "./Argument";

export const Arguments: FC = ({
  arguments: argumentsList,
  type,
  isOpining,
}) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">
        {isOpining ? "Others'" : "Top"} arguments{" "}
        {type === ArgumentTypes.CON ? "against" : "for"}
      </Typography>
      <Stack spacing={2}>
        {argumentsList.map((argument) => (
          <Argument key={argument.id} argument={argument} />
        ))}
      </Stack>
    </Stack>
  );
};
