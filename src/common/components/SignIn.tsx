import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Box, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { registerMui } from "common/utils/registerMui";
import { validateEmail } from "common/utils/validate";
import { useAuth } from "modules/auth/hooks/useAuth";
import { SignInMethod } from "modules/auth/interfaces";
import { useApp } from "modules/app/useApp";
import { AppCache } from "modules/app/cache";
import { Link } from "./Link";

interface WalletNoticeFormProps {
  dontShowNoticeAgain: boolean;
}

export const SignIn = () => {
  const { isSignInDialogOpen, setIsSignInDialogOpen } = useApp();
  const { signInWithEthereum } = useAuth();
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<WalletNoticeFormProps>({
    defaultValues: {
      dontShowNoticeAgain: true,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const signInCallback = () => {
    AppCache.signInCallback && AppCache.signInCallback();
    AppCache.signInCallback = () => {};
  };
  const handleSignInDialogClose = () => {
    setIsSignInDialogOpen(false);
  };

  const handleEthereumSignIn = async () => {
    handleSignInDialogClose();

    try {
      await signInWithEthereum(signInCallback);
      handleSignInDialogClose();
    } catch (e) {
      enqueueSnackbar(e?.message || e, {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={isSignInDialogOpen}
      onClose={handleSignInDialogClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="signin-dialog-title"
    >
      <DialogContent sx={{ paddingTop: 6, paddingBottom: 8 }}>
        <Stack spacing={5}>
          <Stack spacing={2}>
            <Typography variant="h3" component="h1" align="center">
              Notice
            </Typography>
            <Typography variant="body1" align="center">
              If you still don't have a wallet, you can create one with{" "}
              <Link href="https://metamask.io/" blank text>
                Metamask
              </Link>
              .
            </Typography>
            <Typography variant="body1" align="center">
              If don't feel ready to manage private keys by yourself, we
              recommend using{" "}
              <Link href="https://www.ambire.com/" blank text>
                Ambire
              </Link>{" "}
              and backing up keys on{" "}
              <Link
                href="https://help.ambire.com/hc/en-us/articles/4410892186002-What-is-Ambire-Cloud-"
                blank
                text
              >
                Ambire Cloud
              </Link>
              .
            </Typography>
          </Stack>
          <Box
            sx={{
              alignSelf: { xs: "initial", sm: "center" },
              width: { xs: "initial", sm: "350px" },
            }}
          >
            <form onSubmit={handleSubmitHook(handleEthereumSignIn)}>
              <Stack spacing={2}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  // loading={chosenSignInMethod === SignInMethod.ETHEREUM}
                  size="large"
                  // onClick={handleEthereumSignIn}
                >
                  Continue
                </LoadingButton>
              </Stack>
            </form>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
