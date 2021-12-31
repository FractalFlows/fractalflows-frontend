import { FC } from "react";
import { Divider, Stack, Typography } from "@mui/material";

export interface TabPanelProps {
  title: string;
  description: string;
}

export const TabPanel: FC<TabPanelProps> = ({
  title,
  description,
  children,
}) => (
  <>
    <Stack spacing={1}>
      <Typography variant="h5" component="h2" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
    </Stack>
    <Divider sx={{ my: 2 }} />
    {children}
  </>
);
