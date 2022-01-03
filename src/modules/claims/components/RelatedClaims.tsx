import { FC } from "react";
import { Typography, Box, Stack } from "@mui/material";

import { ClaimProps } from "modules/claims/interfaces";
import { ClaimsList } from "./ClaimsList";

export const RelatedClaims: FC<{
  relatedClaims?: ClaimProps[];
}> = ({ relatedClaims = [] }) => {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h2">
          Related claims
        </Typography>
        <Stack spacing={1}>
          <ClaimsList claims={relatedClaims} />
        </Stack>
      </Stack>
    </Box>
  );
};
