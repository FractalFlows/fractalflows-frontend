import { Typography, Box, Stack } from "@mui/material";
import type { NextPage } from "next";

import { ConsiderIt } from "./ConsiderIt";

export const SocialOpinions: NextPage<{}> = ({}) => {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h2">
          Social opinions
        </Typography>
        <ConsiderIt />
      </Stack>
    </Box>
  );
};
