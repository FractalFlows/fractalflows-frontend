import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { registerMui } from "common/utils/registerMui";
import { validateEmail } from "common/utils/validate";
import { useAuth } from "modules/auth/hooks/useAuth";
import { SignInMethod } from "modules/auth/interfaces";
import { useApp } from "modules/app/useApp";
import { AppCache } from "modules/app/cache";

interface EmailFormProps {
  email: string;
  signInCode: string;
}

export const SignIn = () => {
  const { isSignInDialogOpen, setIsSignInDialogOpen } = useApp();
  const { signInWithEthereum, sendSignInCode, verifySignInCode } = useAuth();
  const [chosenSignInMethod, setChosenSignInMethod] = useState<SignInMethod>();
  const [hasSignInCodeBeenSent, setHasSignInCodeBeenSent] =
    useState<Boolean>(false);
  const {
    register,
    getValues,
    reset: resetEmailForm,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<EmailFormProps>({
    defaultValues: {
      email: "",
      signInCode: "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const signInCallback = () => {
    AppCache.signInCallback && AppCache.signInCallback();
    AppCache.signInCallback = () => {};
  };
  const handleReset = () => {
    resetEmailForm();
    setChosenSignInMethod(undefined);
    setHasSignInCodeBeenSent(false);
  };
  const handleSignInDialogClose = () => {
    setIsSignInDialogOpen(false);
    setTimeout(() => {
      handleReset();
    }, 0);
  };
  const handleGoBack = () => {
    handleReset();
  };
  const handleEmailFormSubmit = async ({
    email,
    signInCode,
  }: EmailFormProps) => {
    try {
      if (hasSignInCodeBeenSent) {
        await verifySignInCode({ signInCode });
        handleSignInDialogClose();
        signInCallback();
      } else {
        await sendSignInCode({ email });
        setHasSignInCodeBeenSent(true);
      }
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    }
  };

  const handleEthereumSignIn = async () => {
    handleSignInDialogClose();
    setChosenSignInMethod(SignInMethod.ETHEREUM);

    try {
      await signInWithEthereum(signInCallback);
      handleSignInDialogClose();
    } catch (e: any) {
      enqueueSnackbar(e?.message || e, {
        variant: "error",
      });
    } finally {
      setChosenSignInMethod(undefined);
    }
  };

  const getSubtitle = () => {
    if (chosenSignInMethod === SignInMethod.EMAIL) {
      return hasSignInCodeBeenSent ? (
        <>
          A 6-digit sign in code has been sent to you at{" "}
          <b>{getValues("email")}</b>
        </>
      ) : (
        "Fill in your email address to continue."
      );
    } else
      return "In order to continue, please choose one of the following options:";
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
              Sign in
            </Typography>
            <Typography variant="body1" align="center">
              {getSubtitle()}
            </Typography>
          </Stack>
          <Box
            sx={{
              alignSelf: { xs: "initial", sm: "center" },
              width: { xs: "initial", sm: "350px" },
            }}
          >
            {chosenSignInMethod === SignInMethod.EMAIL ? (
              <form onSubmit={handleSubmitHook(handleEmailFormSubmit)}>
                <Stack spacing={3}>
                  {hasSignInCodeBeenSent ? (
                    <TextField
                      label="Sign in code"
                      fullWidth
                      {...registerMui({
                        register,
                        name: "signInCode",
                        props: {
                          validate: {
                            required: () => hasSignInCodeBeenSent,
                          },
                        },
                        errors,
                      })}
                    />
                  ) : (
                    <TextField
                      label="Email"
                      fullWidth
                      {...registerMui({
                        register,
                        name: "email",
                        props: {
                          required: true,
                          validate: {
                            email: (email: string) => validateEmail(email),
                          },
                        },
                        errors,
                      })}
                    />
                  )}
                  <Stack spacing={2}>
                    <LoadingButton
                      type="submit"
                      size="large"
                      loading={isSubmitting}
                      variant="contained"
                    >
                      {hasSignInCodeBeenSent
                        ? "Verify code"
                        : "Sign in with email"}
                    </LoadingButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={handleGoBack}
                    >
                      Go back
                    </Button>
                  </Stack>
                </Stack>
              </form>
            ) : (
              <Stack spacing={2}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={chosenSignInMethod === SignInMethod.ETHEREUM}
                  size="large"
                  startIcon={<i className="fab fa-ethereum"></i>}
                  onClick={handleEthereumSignIn}
                >
                  Sign in with Ethereum
                </LoadingButton>

                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => setChosenSignInMethod(SignInMethod.EMAIL)}
                >
                  Continue with email
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
