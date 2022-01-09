import { FC } from "react";
import { Typography, Box, Stack } from "@mui/material";

import { ClaimProps } from "modules/claims/interfaces";
import { ClaimsList } from "./ClaimsList";
import { Link } from "common/components/Link";

export const RelatedClaims: FC<{
  relatedClaims?: ClaimProps[];
}> = ({ relatedClaims = [] }) => {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h2">
          Related claims
        </Typography>
        <ClaimsList claims={relatedClaims}>
          We couldn't find any related claims at this time, but you can help by{" "}
          <Link href="/claim/new" text>
            contributing
          </Link>
        </ClaimsList>
      </Stack>
    </Box>
  );
};
