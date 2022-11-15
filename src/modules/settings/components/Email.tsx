import { useEffect, useRef, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { registerMui } from "common/utils/registerMui";
import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";
import { validateEmail } from "common/utils/validate";
import { useAuth } from "modules/auth/hooks/useAuth";

interface EmailFormProps {
  email: string;
  verificationCode: string;
}

export const Email = () => {
  const { session } = useAuth();
  const { updateEmail, sendUpdateEmailVerificationCode } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const [isSendingVerificationCode, setIsSendingVerificationCode] =
    useState(false);
  const [verificationCodeHasBeenSent, setVerificationCodeHasBeenSent] =
    useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const currentEmail = session.user?.email;

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<EmailFormProps>({
    defaultValues: {
      email: currentEmail,
      verificationCode: "",
    },
  });
  const email = watch("email");

  useEffect(() => {
    if (resendCountdown > 0) {
      const countdown = setInterval(() => {
        setResendCountdown(resendCountdown - 1);

        if (resendCountdown === 1) {
          clearInterval(countdown);
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [resendCountdown]);

  const handleSendVerificationCode = async () => {
    setIsSendingVerificationCode(true);

    try {
      await sendUpdateEmailVerificationCode({ email });
      setVerificationCodeHasBeenSent(true);
      enqueueSnackbar(
        "A verification code has been sent to the email address you entered",
        {
          variant: "success",
        }
      );
      setResendCountdown(30);
    } catch (e) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsSendingVerificationCode(false);
    }
  };

  const handleSubmit = async ({ verificationCode }: EmailFormProps) => {
    try {
      if (verificationCodeHasBeenSent) {
        await updateEmail({ verificationCode });
        enqueueSnackbar("Your email has been succesfully updated!", {
          variant: "success",
        });
        setVerificationCodeHasBeenSent(false);
        setValue("verificationCode", "");
      } else {
        await handleSendVerificationCode();
      }
    } catch (e) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    }
  };

  return (
    <TabPanel
      title="Email"
      description="Use your email address to receive app notifications"
    >
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
          {verificationCodeHasBeenSent ? (
            <Stack direction="row" spacing={2}>
              <TextField
                label="Verification code"
                fullWidth
                {...registerMui({
                  register,
                  name: "verificationCode",
                  props: {
                    validate: {
                      required: () => verificationCodeHasBeenSent,
                    },
                  },
                  errors,
                })}
              />
              <LoadingButton
                loading={isSendingVerificationCode}
                onClick={handleSendVerificationCode}
                disabled={resendCountdown !== 0}
                variant="contained"
                color="secondary"
                sx={{ flexShrink: 0 }}
              >
                {resendCountdown === 0
                  ? "Re-send"
                  : `Re-send... ${resendCountdown}s`}
              </LoadingButton>
            </Stack>
          ) : null}

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
            size="large"
            disabled={email === currentEmail}
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            {currentEmail ? "Save" : "Add"}
          </LoadingButton>
        </Stack>
      </form>
    </TabPanel>
  );
};
