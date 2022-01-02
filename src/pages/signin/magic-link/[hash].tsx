import { useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "modules/auth/hooks/useAuth";
import { Check as CheckIcon, Error as ErrorIcon } from "@mui/icons-material";

enum MagicLinkVerificationStatus {
  VERIFYING,
  SUCCESS,
  FAILED,
}

const MagicLinkVerification = () => {
  const router = useRouter();
  const { verifyMagicLink } = useAuth();
  const { hash }: { hash?: string } = router.query;
  const [magicLinkVerificationStatus, setMagicLinkVerificationStatus] =
    useState<MagicLinkVerificationStatus>(
      MagicLinkVerificationStatus.VERIFYING
    );
  const [magicLinkVerificationError, setMagicLinkVerificationError] =
    useState<Error>({});

  useEffect(() => {
    if (hash) {
      verifyMagicLink({ hash })
        .then(() => {
          setMagicLinkVerificationStatus(MagicLinkVerificationStatus.SUCCESS);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        })
        .catch((e) => {
          setMagicLinkVerificationStatus(MagicLinkVerificationStatus.FAILED);
          setMagicLinkVerificationError(e);
        });
    }
  }, [hash]);

  const getContent = () => {
    switch (magicLinkVerificationStatus) {
      case MagicLinkVerificationStatus.VERIFYING:
        return (
          <>
            <CircularProgress size={70} />
            <Typography variant="body1" align="center">
              Please hold on, verifying magic link...
            </Typography>
          </>
        );
      case MagicLinkVerificationStatus.SUCCESS:
        return (
          <>
            <CheckIcon sx={{ fontSize: 70 }} color="success" />
            <Typography variant="body1" align="center">
              Success! You&apos;ve signed in.
            </Typography>
          </>
        );
      case MagicLinkVerificationStatus.FAILED:
        return (
          <>
            <ErrorIcon sx={{ fontSize: 70 }} color="error" />
            <Typography variant="body1" align="center">
              {magicLinkVerificationError.message}
            </Typography>
          </>
        );
    }
  };

  return (
    <Box className="container page">
      <Stack spacing={5} alignItems="center">
        {getContent()}
      </Stack>
    </Box>
  );
};

export default MagicLinkVerification;
