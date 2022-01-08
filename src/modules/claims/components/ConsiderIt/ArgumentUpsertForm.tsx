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
  KnowledgeBitSides,
} from "modules/claims/interfaces";
import { useRouter } from "next/router";
import { UpsertFormOperation } from "common/interfaces";
import { mapArray } from "common/utils/mapArray";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useKnowledgeBits } from "modules/claims/hooks/useKnowledgeBits";
import { filter } from "lodash-es";
import { useOpinions } from "modules/claims/hooks/useOpinions";

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
  const { createArgument, updateArgument } = useArguments();
  const { addArgumentToOpinion } = useOpinions();
  const { enqueueSnackbar } = useSnackbar();
  const { knowledgeBits } = useKnowledgeBits();
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

  const handleSubmit = async (data: ArgumentFormProps) => {
    const mapArgument = () => ({
      summary: data.summary,
      side: argument.side,
      evidences: mapArray(data.evidences, ["id"]),
    });

    try {
      if (operation === UpsertFormOperation.CREATE) {
        const addedArgument = await createArgument({
          claimSlug,
          argument: mapArgument(),
        });
        addArgumentToOpinion(addedArgument);
      } else {
        await updateArgument({
          id: argument?.id as string,
          argument: mapArgument(),
        });
      }
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

  useEffect(() => {
    const evidencesOptions = filter(knowledgeBits, {
      side:
        argument.side === ArgumentSides.CON
          ? KnowledgeBitSides.REFUTING
          : KnowledgeBitSides.SUPPORTING,
    }).map(({ id, name }: KnowledgeBitProps) => ({
      id,
      label: name,
    }));

    setEvidencesOptions(evidencesOptions);
  }, [knowledgeBits]);

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
          label="Evidences"
          name="evidences"
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
