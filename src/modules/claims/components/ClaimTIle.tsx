import { Paper, Typography } from "@mui/material";

export interface ClaimTitleProps {
  title: string;
  summary?: string;
}

export const ClaimTile = ({ title, summary }: ClaimTitleProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {summary ? <Typography variant="body1">{summary}</Typography> : null}
    </Paper>
  );
};
