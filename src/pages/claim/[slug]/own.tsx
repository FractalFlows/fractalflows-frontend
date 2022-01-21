import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { get, isEmpty } from "lodash-es";

import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";
import {
  ClaimUpsertForm,
  ClaimUpsertFormOperation,
} from "modules/claims/components/ClaimUpsertForm";
import { ClaimProps } from "modules/claims/interfaces";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Spinner } from "common/components/Spinner";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "common/components/Link";
import { ConnectTwitter } from "common/components/ConnectTwitter";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";

enum ClaimOwnershipStatus {
  LOADING,
  ALREADY_OWNED,
  TWITTER_NOT_CONNECTED,
  TWITTER_CONNECTED,
}

const OwnClaim: NextPage = () => {
  const { session } = useAuth();
  const { getPartialClaim } = useClaims();
  const [claim, setClaim] = useState<ClaimProps>();
  const [claimOwnershipStatus, setClaimOwnershipStatus] =
    useState<ClaimOwnershipStatus>(ClaimOwnershipStatus.LOADING);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { slug }: { slug?: string } = router.query;

  useEffect(() => {
    if (slug) {
      getPartialClaim({ slug })
        .then((data) => {
          setClaim(data);

          if (
            get(data, "user.username") !==
            process.env.NEXT_PUBLIC_FRACTALFLOWS_BOT_USERNAME
          ) {
            setClaimOwnershipStatus(ClaimOwnershipStatus.ALREADY_OWNED);
          } else if (isEmpty(get(session, "user.twitter"))) {
            setClaimOwnershipStatus(ClaimOwnershipStatus.TWITTER_NOT_CONNECTED);
          }
        })
        .catch((e: any) =>
          enqueueSnackbar(e?.message, {
            variant: "error",
          })
        )
        .finally(() => {});
    }
  }, [slug, session.user]);

  useEffect(() => {
    if (get(session, "user.twitter")) {
      console.log("user has twitter");
    }
  }, [session.user]);

  if (isEmpty(session)) return <AuthWall />;

  const getContent = () => {
    switch (claimOwnershipStatus) {
      case ClaimOwnershipStatus.ALREADY_OWNED:
        return (
          <Stack direction="row" spacing={1}>
            <Typography variant="body1" align="center">
              This claim is already owned by
            </Typography>
            <AvatarWithUsername user={get(claim, "user")} size={20} />
          </Stack>
        );
      case ClaimOwnershipStatus.TWITTER_NOT_CONNECTED:
        return (
          <>
            <Typography variant="body1" align="center">
              In order to own this claim, you&apos;ll need to connect your
              Twitter account to prove you are the original tweet owner,{" "}
              <strong>@{get(claim, "tweetOwner")}</strong>.
            </Typography>
            <ConnectTwitter />
          </>
        );
      // case ClaimOwnershipStatus.FAILED:
      //   return (
      //     <>
      //       <ErrorIcon sx={{ fontSize: 70 }} color="error" />
      //       <Typography variant="body1" align="center">
      //         {magicLinkVerificationError?.message}
      //       </Typography>
      //     </>
      //   );
    }
  };
  return (
    <Box className="container page">
      {claimOwnershipStatus === ClaimOwnershipStatus.LOADING ? (
        <Spinner p={0} />
      ) : (
        <Stack alignItems="center">
          <Stack spacing={6} alignItems="center" sx={{ maxWidth: 500 }}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h1" align="center">
                Own
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                color="textSecondary"
                align="center"
              >
                {get(claim, "title")}
              </Typography>
            </Stack>
            {getContent()}
            <Link href={`/claim/${get(claim, "slug")}`}>
              <Button size="large" variant="contained" color="secondary">
                Go to claim
              </Button>
            </Link>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default OwnClaim;
