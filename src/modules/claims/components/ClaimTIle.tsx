import { FC } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { isEmpty, get, filter } from "lodash-es";

import { Link } from "common/components/Link";
import type { ClaimProps } from "../interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { TagProps } from "modules/tags/interfaces";
import { KnowledgeBitSides } from "modules/claims/interfaces";
import { Histogram, HistogramPlacement } from "./ConsiderIt/Histogram";

export const ClaimTile: FC<{ claim: ClaimProps }> = ({ claim }) => {
  const refutingKnowledgeBitsCount = filter(get(claim, "knowledgeBits"), {
    side: KnowledgeBitSides.REFUTING,
  }).length;
  const supportingKnowledgeBitsCount = filter(get(claim, "knowledgeBits"), {
    side: KnowledgeBitSides.SUPPORTING,
  }).length;

  return (
    <Link href={`/claim/${claim?.slug}`}>
      <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
        <Stack spacing={1}>
          <Typography variant="h5" component="h2">
            {claim?.title}
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Stack spacing={2} flexGrow={1}>
              {claim?.user ? (
                <AuthorBlock
                  user={claim?.user}
                  origin={claim?.origin}
                  createdAt={claim?.createdAt}
                  size={25}
                />
              ) : null}
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
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 1, md: 4 }}
              >
                <Stack direction="row" spacing={1}>
                  <ArrowDownwardIcon color="error" sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {refutingKnowledgeBitsCount} knowledge bit
                    {refutingKnowledgeBitsCount === 1 ? "" : "s"} refuting it
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <ArrowUpwardIcon color="success" sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {supportingKnowledgeBitsCount} knowledge bit
                    {supportingKnowledgeBitsCount === 1 ? "" : "s"} supporting
                    it
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack sx={{ width: 300 }}>
              <Histogram
                opinions={claim.opinions}
                height={100}
                placement={HistogramPlacement.CLAIM_TILE}
              />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Link>
  );
};
