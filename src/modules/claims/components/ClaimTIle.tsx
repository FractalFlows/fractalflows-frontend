import { FC } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";

import { Link } from "common/components/Link";
import type { ClaimProps } from "../interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { TagProps } from "modules/tags/interfaces";
import { isEmpty } from "lodash-es";

export const ClaimTile: FC<{ claim: ClaimProps }> = ({ claim }) => {
  return (
    <Link href={`/claim/${claim?.slug}`}>
      <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h2">
              {claim?.title}
            </Typography>
            {claim?.user ? (
              <AuthorBlock
                user={claim.user}
                createdAt={claim?.createdAt}
                size={25}
              />
            ) : null}
          </Stack>
          {claim?.summary ? (
            <Typography variant="body1" title={claim.summary}>
              {claim.summary.substring(0, 350)}
              {claim.summary.length > 350 ? "..." : ""}
            </Typography>
          ) : null}
          {isEmpty(claim?.tags) ? null : (
            <Stack direction="row" spacing={1}>
              {claim?.tags?.map(({ id, label }: TagProps) => (
                <Chip key={id} label={label} />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Link>
  );
};
