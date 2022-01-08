import { FC } from "react";
import { isEmpty, map, sortBy } from "lodash-es";
import { Stack, Typography } from "@mui/material";

import { Argument } from "./Argument";
import { ArgumentProps } from "modules/claims/interfaces";
import { NoResults } from "common/components/NoResults";

interface ArgumentColumnProps {
  title: string;
  arguments: ArgumentProps[];
}

export const ArgumentColumn: FC<ArgumentColumnProps> = ({
  title,
  arguments: argumentsList = [],
}) => {
  const sortedArgumentsList = sortBy(argumentsList, [
    "opinions.length",
    "comments.length",
    "createdAt",
  ]).reverse();

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{title}</Typography>
      <Stack spacing={2} sx={{ width: 330 }}>
        {isEmpty(sortedArgumentsList) ? (
          <NoResults p={0} align="left">
            No arguments
          </NoResults>
        ) : (
          map(sortedArgumentsList, (argument) => (
            <Argument key={argument.id} argument={argument} />
          ))
        )}
      </Stack>
    </Stack>
  );
};
