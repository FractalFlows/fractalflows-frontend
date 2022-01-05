import type { FC } from "react";
import {
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { useForm, useFieldArray, NestedValue } from "react-hook-form";

import {
  Autocomplete,
  AutocompleteOptionProps,
} from "common/components/Autocomplete";
import { useClaims } from "modules/claims/hooks/useClaims";
import { validateEmail } from "common/utils/validate";
import { registerMui } from "common/utils/registerMui";
import { map } from "lodash-es";

interface InviteFriendsProps {
  open: boolean;
  handleClose: () => any;
}

interface InviteFriendsFormProps {
  emails: string[];
  message?: string;
}

const defaultValues = {
  emails: [],
  message: "",
};

export const InviteFriends: FC<InviteFriendsProps> = ({
  open,
  handleClose,
}) => {
  const { inviteFriends } = useClaims();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<InviteFriendsFormProps>({ defaultValues });

  const handleSubmit = async ({ emails, message }: InviteFriendsFormProps) => {
    try {
      await inviteFriends({
        slug: router.query.slug as string,
        emails: map(emails, "label"),
        message,
      });
      enqueueSnackbar("Your friends have been succesfully invited!", {
        variant: "success",
      });
      reset(defaultValues);
      handleClose();
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="invite-friends-dialog-title"
    >
      <DialogTitle id="invite-friends-dialog-title">Invite friends</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmitHook(handleSubmit)}>
          <Stack>
            <Stack spacing={3}>
              <Typography variant="body1">
                Type your friends&apos; email address and press enter to insert
                it. You can include as many friends as you want.
              </Typography>

              <Autocomplete
                control={control}
                multiple
                errors={errors}
                options={[]}
                name="emails"
                label="Emails"
                freeSolo
                rules={{
                  required: true,
                  minLength: 1,
                  validate: {
                    emails: (emails: AutocompleteOptionProps[]) =>
                      emails.reduce(
                        (acc: boolean, curr) =>
                          acc && validateEmail(curr.label),
                        true
                      ),
                  },
                }}
              />

              <TextField
                label="Message"
                multiline
                minRows={4}
                maxRows={Infinity}
                fullWidth
                {...registerMui({
                  register,
                  name: "message",
                  errors,
                })}
              ></TextField>

              <LoadingButton
                type="submit"
                loading={isSubmitting}
                variant="contained"
                size="large"
              >
                Invite friends
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};
