import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { isEmpty } from "lodash-es";

import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { ClaimProps } from "modules/claims/interfaces";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Spinner } from "common/components/Spinner";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "common/components/Link";
import { ConnectTwitter } from "common/components/ConnectTwitter";

const OwnClaim: NextPage = () => {
  const { session } = useAuth();
  const { getPartialClaim } = useClaims();
  const [claim, setClaim] = useState<ClaimProps>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { slug }: { slug?: string } = router.query;

  useEffect(() => {
    if (slug) {
      getPartialClaim({ slug })
        .then((data) => setClaim(data))
        .catch((e) =>
          enqueueSnackbar(e.message, {
            variant: "error",
          })
        );
    }
  }, [slug]);

  if (isEmpty(session)) return <AuthWall />;

  return (
    <Box className="container page">
      {claim ? (
        <Stack alignItems="center">
          <Stack spacing={6} alignItems="center" sx={{ maxWidth: 500 }}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h1" align="center">
                Own
              </Typography>
              <Link href={`/claim/${claim.slug}`} text>
                <Typography variant="h5" component="h2" align="center">
                  &quot;{claim?.title}&quot;
                </Typography>
              </Link>
            </Stack>
            <Typography variant="body1" align="center">
              In order to own this claim, you&apos;ll need to connect your
              Twitter account to prove you are the original tweet owner,{" "}
              <strong>@{claim.tweetOwner}</strong>.
            </Typography>
            <ConnectTwitter />
          </Stack>
        </Stack>
      ) : (
        <Spinner p={0} />
      )}
    </Box>
  );
};

export default OwnClaim;
