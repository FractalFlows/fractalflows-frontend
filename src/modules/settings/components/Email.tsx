import { Stack, TextField } from "@mui/material";
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
}

export const Email = () => {
  const { session } = useAuth();
  const { updateEmail } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const currentEmail = session.user?.email;

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<EmailFormProps>({
    defaultValues: {
      email: currentEmail,
    },
  });

  const handleSubmit = async ({ email }: EmailFormProps) => {
    try {
      await updateEmail({ email });
      enqueueSnackbar("Your email has been succesfully updated!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  return (
    <TabPanel
      title="Email"
      description="Use your email address to sign in and receive app notifications"
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
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
            size="large"
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            {currentEmail ? "Save" : "Add"}
          </LoadingButton>
        </Stack>
      </form>
    </TabPanel>
  );
};
