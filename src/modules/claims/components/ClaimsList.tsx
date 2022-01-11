import { FC, useEffect, useRef } from "react";
import { Stack } from "@mui/material";
import { isEmpty } from "lodash-es";

import type { ClaimProps } from "../interfaces";
import { ClaimTile } from "./ClaimTIle";
import { NoResults } from "common/components/NoResults";
import { Spinner } from "common/components/Spinner";

export interface ClaimsListProps {
  claims: ClaimProps[];
  loading?: boolean;
  loadingMore?: boolean;
  spinnerColor?: string;
  handleFetchMore?: () => any;
}

export const ClaimsList: FC<ClaimsListProps> = ({
  children,
  loading,
  loadingMore,
  spinnerColor = "primary",
  claims = [],
  handleFetchMore,
}) => {
  const claimsListEndEl = useRef();

  useEffect(() => {
    if (handleFetchMore) {
      const infiniteScrollIntersectionObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].intersectionRatio <= 0) return;
          handleFetchMore();
        }
      );

      if (claimsListEndEl.current) {
        infiniteScrollIntersectionObserver?.observe(claimsListEndEl.current);
      }

      return () => infiniteScrollIntersectionObserver.disconnect();
    }
  }, [handleFetchMore, claimsListEndEl]);

  if (loading) {
    return <Spinner color={spinnerColor} />;
  } else if (isEmpty(claims)) {
    return <NoResults>{children || "No claims found"}</NoResults>;
  }

  return (
    <>
      <Stack spacing={2}>
        {claims.map((claim) => (
          <ClaimTile claim={claim} key={claim.slug} />
        ))}
      </Stack>
      {loadingMore ? <Spinner color={spinnerColor} /> : null}
      <div ref={claimsListEndEl} />
    </>
  );
};
