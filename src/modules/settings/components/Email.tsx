import { Stack, Typography, Divider, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { registerMui } from "common/utils/registerMui";
import { TabPanel } from "./TabPanel";

export const Email = () => {
  // const { createClaim } = useClaims();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (claim) => {
    try {
      // const { slug } = await createClaim({ claim });
      // enqueueSnackbar("Your new claim has been succesfully added!", {
      //   variant: "success",
      // });
      // router.push(`/claim/${slug}`);
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  return (
    <TabPanel
      title="Email"
      description="Use email to login and receive app notifications"
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
              },
              errors,
            })}
          />
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
            size="large"
            sx={{ alignSelf: "start" }}
          >
            Save
          </LoadingButton>
        </Stack>
      </form>
    </TabPanel>
  );
};
