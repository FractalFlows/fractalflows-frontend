import { Stack } from "@mui/material";

import type { ClaimProps } from "../interfaces";
import { ClaimTile } from "./ClaimTIle";

export interface ClaimsListProps {
  claims: ClaimProps[];
}

export const ClaimsList = ({ claims = [] }: ClaimsListProps) => {
  return (
    <Stack spacing={1}>
      {claims.map((claim) => (
        <ClaimTile {...claim} key={claim.slug} />
      ))}
    </Stack>
  );
};
