import { FC } from "react";
import { Stack } from "@mui/material";
import { isEmpty } from "lodash-es";

import type { ClaimProps } from "../interfaces";
import { ClaimTile } from "./ClaimTIle";
import { NoResults } from "common/components/NoResults";
import { Spinner } from "common/components/Spinner";

export interface ClaimsListProps {
  claims: ClaimProps[];
  loading?: boolean;
}

export const ClaimsList: FC<ClaimsListProps> = ({
  children,
  loading,
  claims = [],
}) => {
  if (loading) {
    return <Spinner />;
  } else if (isEmpty(claims)) {
    return <NoResults>{children || "No claims found"}</NoResults>;
  }

  return (
    <Stack spacing={2}>
      {claims.map((claim) => (
        <ClaimTile claim={claim} key={claim.slug} />
      ))}
    </Stack>
  );
};
