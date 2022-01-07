import { FC } from "react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField, Typography } from "@mui/material";

import {
  Autocomplete,
  AutocompleteOptionProps,
} from "common/components/Autocomplete";
import { registerMui } from "common/utils/registerMui";
import { useClaims } from "modules/claims/hooks/useClaims";
import {
  ArgumentProps,
  ArgumentSides,
  KnowledgeBitProps,
} from "modules/claims/interfaces";
import { useRouter } from "next/router";
import { UpsertFormOperation } from "common/interfaces";
import { mapArray } from "common/utils/mapArray";
import { useArguments } from "modules/claims/hooks/useArguments";

interface ArgumentFormProps {
  summary: string;
  evidences: string[];
}

const KnowledgeBitUpsertFormOperationTexts = {
  [UpsertFormOperation.CREATE]: {
    submitButton: "Add argument",
    successFeedback: "Your new argument has been succesfully added!",
  },
  [UpsertFormOperation.UPDATE]: {
    submitButton: "Edit argument",
    successFeedback: "Your argument has been succesfully edited!",
  },
};

const argumentFormDefaultValues = {
  summary: "",
  evidences: [],
};

interface ArgumentUpsertFormProps {
  argument: ArgumentProps;
  setPickedArguments: () => any;
  pickedArguments: ArgumentProps[];
  handleClose: () => any;
  operation: UpsertFormOperation;
}

export const ArgumentUpsertForm: FC<ArgumentUpsertFormProps> = ({
  argument,
  operation,
  handleClose,
}) => {
  const {
    addPickedArgument,
    createArgument,
    updateArgument,
    argumentsList,
    pickedArguments,
  } = useArguments();
  const { getKnowledgeBits } = useClaims();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { slug: claimSlug }: { slug?: string } = router.query;
  const {
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<ArgumentFormProps>({ defaultValues: argumentFormDefaultValues });

  const [evidencesOptions, setEvidencesOptions] = useState<
    AutocompleteOptionProps[]
  >([]);
  const [evidencesOptionsLoading, setEvidencesOptionsLoading] = useState(false);

  const handleSubmit = async (data: ArgumentFormProps) => {
    const mapArgument = () => ({
      summary: data.summary,
      side: argument.side,
      evidences: mapArray(data.evidences, ["id"]),
    });

    try {
      const addedArgument = await (operation === UpsertFormOperation.CREATE
        ? createArgument({ claimSlug, argument: mapArgument() })
        : updateArgument({
            id: argument?.id as string,
            argument: mapArgument(),
          }));
      addPickedArgument(addedArgument);
      enqueueSnackbar(
        KnowledgeBitUpsertFormOperationTexts[operation].submitButton,
        {
          variant: "success",
        }
      );
      reset(argumentFormDefaultValues);
      handleClose();
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  const getEvidences = useCallback(async () => {
    setEvidencesOptionsLoading(true);

    try {
      const evidences = await getKnowledgeBits({
        claimSlug,
      });
      setEvidencesOptions(
        evidences.map(({ id, name }: KnowledgeBitProps) => ({
          id,
          label: name,
        }))
      );
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setEvidencesOptionsLoading(false);
    }
  }, [enqueueSnackbar, getKnowledgeBits]);

  useEffect(() => {
    getEvidences();
  }, []);

  return (
    <form onSubmit={handleSubmitHook(handleSubmit)}>
      <Stack spacing={3}>
        <TextField
          label="Summary"
          multiline
          minRows={4}
          maxRows={Infinity}
          fullWidth
          {...registerMui({
            register,
            name: "summary",
            props: {
              required: true,
            },
            errors,
          })}
        ></TextField>
        <Autocomplete
          control={control}
          multiple
          errors={errors}
          options={evidencesOptions}
          loading={evidencesOptionsLoading}
          label="Evidences"
          name="evidences"
          rules={{
            required: true,
            minLength: 1,
          }}
        />

        <Stack spacing={1}>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
          >
            {KnowledgeBitUpsertFormOperationTexts[operation].submitButton}
          </LoadingButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClose();
              reset(argumentFormDefaultValues);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
