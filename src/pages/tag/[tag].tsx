import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import type { NextPage } from "next";
import { Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { ClaimsList } from "modules/claims/components/ClaimsList";
import { useClaims } from "modules/claims/hooks/useClaims";
import { ClaimsService } from "modules/claims/services/claims";
import { Spinner } from "common/components/Spinner";
import { TagProps } from "modules/tags/interfaces";
import { PaginatedClaimsProps } from "modules/claims/interfaces";

interface TagComponentProps {
  tag: TagProps;
  claimsByTag: PaginatedClaimsProps;
}

const limit = 10;

const Tag: NextPage<TagComponentProps> = ({
  tag,
  claimsByTag: initialClaimsByTag,
}) => {
  const [claimsByTag, setClaimsByTag] = useState(initialClaimsByTag?.data);
  const [totalCount, setTotalCount] = useState(initialClaimsByTag?.totalCount);
  const { getClaimsByTag } = useClaims();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleFetchMore = async () => {
    if (totalCount <= offset + limit || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const updatedOffset = offset + limit;
      setOffset(offset + limit);
      await getClaimsByTag({
        tag: router.query.tag as string,
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
    setClaimsByTag(initialClaimsByTag?.data);
    setTotalCount(initialClaimsByTag?.totalCount);
  }, [initialClaimsByTag]);

  return (
    <Container className="page">
      {router.isFallback ? (
        <Spinner />
      ) : (
        <Stack spacing={5}>
          <Typography variant="h3" component="h1">
            Tag: &quot;{tag?.label}&quot;
          </Typography>
          <Typography variant="body1" alignSelf="flex-end">
            Showing {claimsByTag?.length} of {totalCount}
          </Typography>
          <ClaimsList
            claims={claimsByTag}
            loadingMore={isLoadingMore}
            handleFetchMore={handleFetchMore}
          />
        </Stack>
      )}
    </Container>
  );
};

export async function getStaticProps({ params }) {
  try {
    const props = await ClaimsService.getClaimsByTag({
      tag: params.tag,
      offset: 0,
      limit,
    });

    return {
      props,
      revalidate: 10,
    };
  } catch (e) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default Tag;
