import { FC, ReactNode } from "react";
import { Divider, Stack, Typography } from "@mui/material";

export interface TabPanelProps {
  title: string | ReactNode;
  description: string | ReactNode;
}

export const TabPanel: FC<TabPanelProps> = ({
  title,
  description,
  children,
}) => (
  <>
    <Stack spacing={1}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
    </Stack>
    <Divider sx={{ my: 2 }} />
    {children}
  </>
);
