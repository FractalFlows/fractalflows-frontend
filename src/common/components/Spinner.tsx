import { FC } from "react";
import { CircularProgress, Stack } from "@mui/material";

export const Spinner: FC<{ size?: number }> = ({ size = 40 }) => (
  <Stack sx={{ p: 6 }} alignItems="center">
    <CircularProgress size={size} />
  </Stack>
);
