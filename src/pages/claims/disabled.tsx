import type { NextPage } from "next";
import { isEmpty } from "lodash-es";
import { Container, Stack, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import { useClaims } from "modules/claims/hooks/useClaims";
import { useEffect, useState } from "react";
import { ClaimProps } from "modules/claims/interfaces";
import { useSnackbar } from "notistack";

const limit = 10;

const DisabledClaim: NextPage = () => {
  const { session } = useAuth();
  const {
    getDisabledClaims,
    getMoreDisabledClaims,
    disabledClaims,
    disabledClaimsTotalCount: totalCount,
  } = useClaims();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const handleFetch = async () => {
    const pagination = { limit, offset: 0 };

    try {
      await getDisabledClaims(pagination);
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetchMore = async () => {
    if (totalCount <= offset + limit || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const updatedOffset = offset + limit;
      setOffset(offset + limit);
      await getMoreDisabledClaims({
        limit,
        offset: updatedOffset,
      });
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isEmpty(session) === false) {
      handleFetch();
    }
  }, [session]);

  return (
    <Container className="page">
      <Stack spacing={5}>
        <Typography variant="h3" component="h1">
          Disabled claims
        </Typography>
        {isLoading ? null : (
          <Typography variant="body1" alignSelf="flex-end">
            Showing {disabledClaims.length} of {totalCount}
          </Typography>
        )}
        <ClaimsList
          claims={disabledClaims}
          loading={isLoading}
          loadingMore={isLoadingMore}
          handleFetchMore={handleFetchMore}
        />
      </Stack>
    </Container>
  );
};

export default DisabledClaim;
