import { Box, Stack, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { isEmpty } from "lodash-es";

import { registerMui } from "common/utils/registerMui";
import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";
import { useAuth } from "modules/auth/hooks/useAuth";
import { RadioGroup } from "common/components/RadioGroup";
import {
  validateCustomUsernameCharacters,
  validateCustomUsernameMinLength,
  validateCustomUsernameMaxLength,
} from "common/utils/validate";
import {
  AvatarSource,
  UpdateProfileProps,
  UsernameSource,
} from "../interfaces";

export const Profile = () => {
  const {
    session: { user },
  } = useAuth();
  const { updateProfile } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<UpdateProfileProps>({
    defaultValues: {
      usernameSource: user?.usernameSource,
      username: user?.username,
      avatarSource: user?.avatarSource,
    },
  });

  const isEthereumWalletConnected = user?.ethAddress ? true : false;
  const usernameSourceOptions = [
    {
      label: "Use my primary ENS name (or Ethereum address)",
      value: UsernameSource.ENS,
      disabled: isEthereumWalletConnected === false,
    },
    { label: "Set a custom username", value: UsernameSource.CUSTOM },
  ];
  const avatarSourceOptions = [
    {
      label: "Use avatar from my ENS Profile",
      value: AvatarSource.ENS,
      disabled: isEthereumWalletConnected === false,
    },
    {
      label: "Gravatar",
      value: AvatarSource.GRAVATAR,
      disabled: isEmpty(user?.email),
    },
  ];

  const handleSubmit = async ({
    usernameSource,
    username,
    avatarSource,
  }: UpdateProfileProps) => {
    try {
      await updateProfile({ usernameSource, username, avatarSource });
      enqueueSnackbar("Your profile has been succesfully updated!", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    }
  };

  const usernameSource = watch("usernameSource");

  return (
    <TabPanel title="Profile" description="Customize your profile">
      <form onSubmit={handleSubmitHook(handleSubmit)}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <RadioGroup
              label="Username"
              name="usernameSource"
              options={usernameSourceOptions}
              control={control}
              errors={errors}
              rules={{
                required: true,
                deps: ["username"],
              }}
            ></RadioGroup>
            {usernameSource === UsernameSource.CUSTOM ? (
              <Box sx={{ paddingLeft: "31px" }}>
                <TextField
                  fullWidth
                  {...registerMui({
                    register,
                    name: "username",
                    props: {
                      validate: {
                        required: (customUsername) =>
                          usernameSource === UsernameSource.CUSTOM &&
                          isEmpty(customUsername) === false,
                        customUsernameCharacters: (customUsername) =>
                          validateCustomUsernameCharacters(customUsername),
                        customUsernameMinLength: (customUsername) =>
                          validateCustomUsernameMinLength(customUsername),
                        customUsernameMaxLength: (customUsername) =>
                          validateCustomUsernameMaxLength(customUsername),
                      },
                    },
                    errors,
                  })}
                />
              </Box>
            ) : null}
          </Stack>

          <RadioGroup
            label="Avatar"
            name="avatarSource"
            options={avatarSourceOptions}
            control={control}
            errors={errors}
            rules={{
              required: true,
            }}
          ></RadioGroup>

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
            size="large"
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            Save
          </LoadingButton>
        </Stack>
      </form>
    </TabPanel>
  );
};
