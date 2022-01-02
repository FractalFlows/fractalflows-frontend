import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { registerMui } from "common/utils/registerMui";
import { validateEmail } from "common/utils/validate";
import { useAuth } from "modules/auth/hooks/useAuth";
import { SignInMethod } from "modules/auth/interfaces";

interface MagicLinkFormProps {
  email: string;
}

export const AuthWall = () => {
  const { signInWithEthereum, sendMagicLink } = useAuth();
  const [chosenSignInMethod, setChosenSignInMethod] = useState<SignInMethod>();
  const [hasMagicLinkBeenSent, setHasMagicLinkBeenSent] =
    useState<Boolean>(false);
  const {
    register,
    getValues,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<MagicLinkFormProps>({
    defaultValues: {
      email: "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async ({ email }: MagicLinkFormProps) => {
    try {
      await sendMagicLink({ email });
      setHasMagicLinkBeenSent(true);
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  const signInCallback = () => {
    if (router.route === "/signin") router.push("/");
  };

  const getSubtitle = () => {
    if (chosenSignInMethod === SignInMethod.MAGIC_LINK) {
      return hasMagicLinkBeenSent
        ? null
        : "Fill in your email address to receive a magic sign in link.";
    } else
      return "In order to continue, please choose one of the following options:";
  };

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Stack spacing={2}>
          <Typography variant="h3" component="h1" align="center">
            Sign in
          </Typography>
          <Typography variant="body1" align="center">
            {getSubtitle()}
          </Typography>
        </Stack>
        {chosenSignInMethod === SignInMethod.MAGIC_LINK ? (
          <Stack sx={{ alignSelf: "center" }}>
            {hasMagicLinkBeenSent ? (
              <Typography variant="body1">
                We sent an email to you at <b>{getValues("email")}</b>. It has a
                magic link that'll sign you in.
              </Typography>
            ) : (
              <form onSubmit={handleSubmitHook(handleSubmit)}>
                <Stack spacing={3}>
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
                  <Stack spacing={2}>
                    <LoadingButton
                      type="submit"
                      size="large"
                      loading={isSubmitting}
                      variant="contained"
                    >
                      Send magic link
                    </LoadingButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => setChosenSignInMethod(undefined)}
                    >
                      Go back
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
          </Stack>
        ) : (
          <Stack sx={{ alignSelf: "center" }} spacing={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<i className="fab fa-ethereum"></i>}
              onClick={() => signInWithEthereum(signInCallback)}
            >
              Sign in with Ethereum
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setChosenSignInMethod(SignInMethod.MAGIC_LINK)}
            >
              Continue with email
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
