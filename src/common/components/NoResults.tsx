import { FC } from "react";
import { Typography } from "@mui/material";

export const NoResults: FC = ({ children }) => (
  <Typography variant="body1" sx={{ p: 6 }} align="center">
    {children}
  </Typography>
);
