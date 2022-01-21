import { FC } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";
import { get } from "lodash-es";

import { registerMui } from "common/utils/registerMui";
import { UpsertFormOperation } from "common/interfaces";
import { useArgumentComments } from "modules/argument-comments/useArgumentComments";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";

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
  argumentComment: ArgumentCommentProps;
  handleClose?: () => any;
  handleSuccess: (prop: ArgumentCommentProps) => any;
  operation: UpsertFormOperation;
}

export const ArgumentCommentUpsertForm: FC<ArgumentCommentUpsertFormProps> = ({
  argumentComment,
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
    defaultValues: {
      content: get(argumentComment, "content", ""),
    },
  });

  const handleSubmit = async (data: ArgumentCommentUpsertFormDataProps) => {
    try {
      const savedArgumentComment = await (operation ===
      UpsertFormOperation.CREATE
        ? createArgumentComment({
            argumentComment: {
              content: data.content,
              argument: { id: get(argumentComment, "argument.id") },
            },
          })
        : updateArgumentComment({
            argumentComment: {
              id: get(argumentComment, "id"),
              content: data.content,
              argument: { id: get(argumentComment, "argument.id") },
            },
          }));
      enqueueSnackbar(
        ArgumentCommentUpsertFormOperationTexts[operation].successFeedback,
        {
          variant: "success",
        }
      );
      reset(argumentCommentFormDefaultValues);
      handleSuccess && handleSuccess(savedArgumentComment);
      handleClose && handleClose();
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
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

        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
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
