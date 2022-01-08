import { FC } from "react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";

import { registerMui } from "common/utils/registerMui";
import { UpsertFormOperation } from "common/interfaces";
import { useArgumentComments } from "modules/argument-comments/useArgumentComments";

const ArgumentCommentUpsertFormOperationTexts = {
  [UpsertFormOperation.CREATE]: {
    successFeedback: "Your new comment has been succesfully added!",
  },
  [UpsertFormOperation.UPDATE]: {
    successFeedback: "Your comment has been succesfully edited!",
  },
};

const argumentCommentFormDefaultValues = {
  content: "",
};

interface ArgumentCommentUpsertFormDataProps {
  content: string;
}

interface ArgumentCommentUpsertFormProps {
  argumentId: string;
  handleClose?: () => any;
  handleSuccess: () => any;
  operation: UpsertFormOperation;
}

export const ArgumentCommentUpsertForm: FC<ArgumentCommentUpsertFormProps> = ({
  argumentId,
  operation,
  handleSuccess,
  handleClose,
}) => {
  const { createArgumentComment, updateArgumentComment } =
    useArgumentComments();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<ArgumentCommentUpsertFormDataProps>({
    defaultValues: argumentCommentFormDefaultValues,
  });

  const handleSubmit = async (data: ArgumentCommentUpsertFormDataProps) => {
    const mapArgumentComment = () => ({
      content: data.content,
      argument: { id: argumentId },
    });

    try {
      if (operation === UpsertFormOperation.CREATE) {
        const addedArgumentComment = await createArgumentComment({
          argumentComment: mapArgumentComment(),
        });
        handleSuccess(addedArgumentComment);
      } else {
        const updatedArgumentComment = await updateArgumentComment({
          id: get(argumentComment, "id"),
          argumentComment: mapArgumentComment(),
        });
        handleSuccess(updatedArgumentComment);
      }
      enqueueSnackbar(
        ArgumentCommentUpsertFormOperationTexts[operation].successFeedback,
        {
          variant: "success",
        }
      );
      reset(argumentCommentFormDefaultValues);
      handleClose && handleClose();
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
                handleClose && handleClose();
                reset(argumentCommentFormDefaultValues);
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
