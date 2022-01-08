import { FC } from "react";
import { CircularProgress, Stack } from "@mui/material";

interface SpinnerProps {
  size?: number;
  p?: number;
}

export const Spinner: FC<SpinnerProps> = ({ size = 40, p = 6 }) => (
  <Stack sx={{ p }} alignItems="center">
    <CircularProgress size={size} />
  </Stack>
);
