import { useEffect } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTwitter } from "modules/twitter/useTwitter";
import { useSnackbar } from "notistack";

const ConnectCallback = () => {
  const router = useRouter();
  const { validateOAuth } = useTwitter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    callbackPathname,
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
  }: {
    callbackPathname?: string;
    oauth_token?: string;
    oauth_verifier?: string;
  } = router.query;

  useEffect(() => {
    if (window.location.hostname === "127.0.0.1") {
      window.location.href = window.location.href.replace(
        "127.0.0.1",
        "localhost"
      );
    }

    if (router.isReady) {
      validateOAuth({ oauthToken, oauthVerifier })
        .then(() => {
          enqueueSnackbar(
            "Your Twitter account has been succesfully connected!",
            { variant: "success" }
          );
        })
        .catch((e: any) => {
          enqueueSnackbar(e?.message || e, { variant: "error" });
        })
        .finally(() => {
          router.push(callbackPathname as string);
        });
    }
  }, [router.isReady]);

  return (
    <Box className="container page">
      <Stack spacing={5} alignItems="center">
        <CircularProgress size={70} />
        <Typography variant="body1" align="center">
          Please hold on, verifying Twitter connection...
        </Typography>
      </Stack>
    </Box>
  );
};

export default ConnectCallback;
