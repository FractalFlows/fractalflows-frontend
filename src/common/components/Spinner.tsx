import { FC } from "react";
import { CircularProgress, CircularProgressProps, Stack } from "@mui/material";

interface SpinnerProps {
  size?: number;
  p?: number;
  color?: CircularProgressProps["color"];
}

export const Spinner: FC<SpinnerProps> = ({
  size = 40,
  p = 6,
  color = "primary",
}) => (
  <Stack sx={{ p }} alignItems="center">
    <CircularProgress size={size} color={color} />
  </Stack>
);
