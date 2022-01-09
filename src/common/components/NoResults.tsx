import { FC } from "react";
import { Typography } from "@mui/material";

interface NoResultsProps {
  p?: number;
  align?: string;
}

export const NoResults: FC<NoResultsProps> = ({
  children,
  p = 6,
  align = "center",
}) => (
  <Typography variant="body1" color="textSecondary" sx={{ p }} align={align}>
    {children || "No results"}
  </Typography>
);
