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
  handleClose: () => any;
  operation: UpsertFormOperation;
}

export const ArgumentCommentUpsertForm: FC<ArgumentUpsertFormProps> = ({
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
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<ArgumentFormProps>({ defaultValues: argumentFormDefaultValues });

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

  return (
    <form onSubmit={handleSubmitHook(handleSubmit)}>
      <Stack spacing={2}>
        <TextField
          placeholder="Leave a comment"
          multiline
          minRows={3}
          maxRows={Infinity}
          fullWidth
          {...registerMui({
            register,
            name: "content",
            props: {
              required: true,
            },
            errors,
          })}
        ></TextField>

        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
          >
            Save comment
          </LoadingButton>
          {operation === UpsertFormOperation.UPDATE ? (
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
          ) : null}
        </Stack>
      </Stack>
    </form>
  );
};
