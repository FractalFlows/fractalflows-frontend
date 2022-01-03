import { Paper, Typography } from "@mui/material";

import { Link } from "common/components/Link";
import type { ClaimProps } from "../interfaces";

export const ClaimTile = ({ title, summary, slug }: ClaimProps) => {
  return (
    <Link href={`/claim/${slug}`}>
      <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {summary ? <Typography variant="body1">{summary}</Typography> : null}
      </Paper>
    </Link>
  );
};
