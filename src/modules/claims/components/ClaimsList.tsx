import { Stack } from "@mui/material";

import type { ClaimProps } from "../interfaces";
import { ClaimTile } from "./ClaimTIle";

export interface ClaimsListProps {
  claims: ClaimProps[];
}

export const ClaimsList = ({ claims = [] }: ClaimsListProps) => {
  return (
    <Stack spacing={2}>
      {claims.map((claim) => (
        <ClaimTile claim={claim} key={claim.slug} />
      ))}
    </Stack>
  );
};
