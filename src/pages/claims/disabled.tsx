import type { NextPage } from "next";
import { isEmpty } from "lodash-es";
import { Container, Box, Stack, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import { useClaims } from "modules/claims/hooks/useClaims";
import { useEffect, useState } from "react";
import { ClaimProps } from "modules/claims/interfaces";
import { useSnackbar } from "notistack";

const limit = 10;

const DisabledClaim: NextPage = () => {
  const { session } = useAuth();
  const { getDisabledClaims } = useClaims();
  const [disabledClaims, setDisabledClaims] = useState<ClaimProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const handleFetch = async () => {
    const pagination = { limit, offset: 0 };

    try {
      const claims = await getDisabledClaims(pagination);
      setDisabledClaims(claims.data);
      setTotalCount(claims.totalCount);
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
      const claims = await getDisabledClaims({
        limit,
        offset: updatedOffset,
      });
      setDisabledClaims(claims.data);
      setTotalCount(claims.totalCount);
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

  if (isEmpty(session)) return <AuthWall />;

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
