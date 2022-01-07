import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Autocomplete } from "common/components/Autocomplete";

import { registerMui } from "common/utils/registerMui";
import { ArgumentTypes } from "modules/claims/interfaces";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Argument } from "./Argument";

interface ArgumentFormProps {
  summary: string;
  evidences: string[];
}

const OpineColumnTexts = {
  [ArgumentTypes.CON]: {
    columnTitle: "against",
    columnSide: "left",
    submitButton: "Host claim",
    successFeedback: "Your new claim has been succesfully added!",
  },
  [ArgumentTypes.PRO]: {
    columnTitle: "for",
    columnSide: "right",
    submitButton: "Edit claim",
    successFeedback: "Your claim has been succesfully edited!",
  },
};

const argumentFormDefaultValues = {
  summary: "",
  evidences: [],
};

export const OpineColumn = ({ type, pickedArguments, setPickedArguments }) => {
  const [isAddingNewArgument, setIsAddingNewArgument] = useState(false);
  const {
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<ArgumentFormProps>({ defaultValues: argumentFormDefaultValues });

  return (
    <Stack sx={{ width: "50%" }} spacing={3}>
      <Typography variant="h5">
        Give your arguments {OpineColumnTexts[type].columnTitle}
      </Typography>
      <Stack spacing={1}>
        {pickedArguments.map((pickedArgument) => (
          <Argument
            key={pickedArgument.id}
            argument={pickedArgument}
            hideReferrers
          />
        ))}
      </Stack>
      <Typography variant="body1">
        Drag an <b>argument {OpineColumnTexts[type].columnTitle}</b> from the{" "}
        {OpineColumnTexts[type].columnSide} or
      </Typography>
      {isAddingNewArgument ? (
        <form>
          <Stack spacing={3}>
            <TextField
              label="Message (optional)"
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
            <Autocomplete
              control={control}
              multiple
              errors={errors}
              options={[]}
              name="evidences"
              label="Evidences"
              freeSolo
              rules={{
                required: true,
                minLength: 1,
                validate: {
                  emails: (emails: AutocompleteOptionProps[]) =>
                    emails.reduce(
                      (acc: boolean, curr) => acc && validateEmail(curr.label),
                      true
                    ),
                },
              }}
            />

            <Stack spacing={1}>
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                variant="contained"
              >
                Save new argument {OpineColumnTexts[type].columnTitle}
              </LoadingButton>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsAddingNewArgument(false);
                  reset(argumentFormDefaultValues);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 1 }}
          onClick={() => setIsAddingNewArgument(true)}
        >
          Write a new argument {OpineColumnTexts[type].columnTitle}
        </Button>
      )}
    </Stack>
  );
};
