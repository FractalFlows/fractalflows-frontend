import { FC, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";
import { findIndex, get } from "lodash-es";

import { registerMui } from "common/utils/registerMui";
import { UpsertFormOperation } from "common/interfaces";
import { useArgumentComments } from "modules/argument-comments/useArgumentComments";
import { ArgumentCommentProps } from "modules/argument-comments/interfaces";
import {
  TransactionProgressModal,
  TransactionStep,
  TransactionStepOperation,
  TransactionStepStatus,
} from "common/components/TransactionProgressModal";

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

const DEFAULT_ARGUMENT_COMMENT_NFT_MINT_TRANSACTION_STEPS = [
  {
    status: TransactionStepStatus.STARTED,
    operation: TransactionStepOperation.UPLOAD,
  },
  {
    status: TransactionStepStatus.UNSTARTED,
    operation: TransactionStepOperation.SIGN,
  },
  {
    status: TransactionStepStatus.UNSTARTED,
    operation: TransactionStepOperation.WAIT_ONCHAIN,
  },
  {
    status: TransactionStepStatus.UNSTARTED,
    operation: TransactionStepOperation.INDEX,
  },
];

export const ArgumentCommentUpsertForm: FC<ArgumentCommentUpsertFormProps> = ({
  argumentComment,
  operation,
  handleSuccess,
  handleClose,
}) => {
  const {
    createArgumentComment,
    updateArgumentComment,
    saveArgumentCommentOnIPFS,
    addArgumentCommentToNFT,
  } = useArgumentComments();
  const [isTransactionProgressModalOpen, setIsTransactionProgressModalOpen] =
    useState(false);
  const [transactionProgressModalSteps, setTransactionProgressModalSteps] =
    useState(DEFAULT_ARGUMENT_COMMENT_NFT_MINT_TRANSACTION_STEPS);
  const transactionProgressModalStepsRef = useRef<TransactionStep[]>([]);
  const savedArgumentComment = useRef<ArgumentCommentProps>({});
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

  transactionProgressModalStepsRef.current = transactionProgressModalSteps;

  const handleTransactionProgressUpdate = (
    updates: {
      operation: TransactionStepOperation;
      update: Partial<TransactionStep>;
    }[] = []
  ) => {
    const updatedTransactionProgressModalSteps = [
      ...transactionProgressModalStepsRef.current,
    ];

    updates.map(({ operation, update = {} }) => {
      const stepIndex = findIndex(updatedTransactionProgressModalSteps, {
        operation,
      });

      updatedTransactionProgressModalSteps[stepIndex] = {
        ...updatedTransactionProgressModalSteps[stepIndex],
        ...update,
      };
    });

    setTransactionProgressModalSteps(updatedTransactionProgressModalSteps);
  };

  const handleTransactionProgressModalClose = () => {
    setIsTransactionProgressModalOpen(false);
  };

  const handleTransactionProgressModalComplete = () => {
    reset(argumentCommentFormDefaultValues);
    handleSuccess && handleSuccess(savedArgumentComment.current);
    handleClose && handleClose();
  };

  const handleSubmit = async (data: ArgumentCommentUpsertFormDataProps) => {
    const handleIndexArgumentCommentNFT = async (transactionData: {
      nftMetadataURI: string;
      nftTxHash?: string;
      nftIndex?: string;
    }) => {
      handleTransactionProgressUpdate([
        {
          operation: TransactionStepOperation.INDEX,
          update: { status: TransactionStepStatus.STARTED },
        },
      ]);

      try {
        if (operation === UpsertFormOperation.CREATE) {
          savedArgumentComment.current = await createArgumentComment({
            argumentComment: {
              content: data.content,
              argument: { id: get(argumentComment, "argument.id") },
              ...transactionData,
            },
          });
        }

        //  updateArgumentComment({
        //           argumentComment: {
        //             id: get(argumentComment, "id"),
        //             content: data.content,
        //             argument: { id: get(argumentComment, "argument.id") },
        //           },
        //         }));

        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.INDEX,
            update: { status: TransactionStepStatus.SUCCESS },
          },
        ]);
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.INDEX,
            update: { status: TransactionStepStatus.ERROR, error: e.message },
          },
        ]);
      }
    };

    const handleAddArgumentCommentToNFT = async ({
      metadataURI,
    }: {
      metadataURI: string;
    }) => {
      handleTransactionProgressUpdate([
        {
          operation: TransactionStepOperation.SIGN,
          update: { status: TransactionStepStatus.STARTED },
        },
      ]);

      try {
        if (operation === UpsertFormOperation.CREATE) {
          const mintArgumentNFTTx = await addArgumentCommentToNFT({
            argumentTokenId: argumentComment.argument.nftTokenId,
            metadataURI,
          });

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.SIGN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.STARTED,
                txHash: mintArgumentNFTTx.hash,
              },
            },
          ]);

          const mintArgumentNFTTxReceipt = await mintArgumentNFTTx.wait();

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
          ]);

          const transferEventTopics = mintArgumentNFTTxReceipt.logs[0].topics;
          const nftIndex = String(parseInt(transferEventTopics[1]));

          await handleIndexArgumentCommentNFT({
            nftMetadataURI: metadataURI,
            nftTxHash: mintArgumentNFTTx.hash,
            nftIndex: nftIndex,
          });
        }
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.SIGN,
            update: {
              status: TransactionStepStatus.ERROR,
              error: e.message,
              retry: () => handleMintArgumentNFT({ metadataURI }),
            },
          },
        ]);
      }
    };

    const handleSaveArgumentCommentOnIPFS = async (
      data: ArgumentCommentUpsertFormDataProps
    ) => {
      setTransactionProgressModalSteps(
        DEFAULT_ARGUMENT_COMMENT_NFT_MINT_TRANSACTION_STEPS
      );
      setIsTransactionProgressModalOpen(true);

      try {
        const saveArgumentCommentOnIPFSResult = await saveArgumentCommentOnIPFS(
          {
            argumentComment: {
              content: data.content,
            },
          }
        );

        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.SUCCESS },
          },
        ]);

        await handleAddArgumentCommentToNFT({
          metadataURI: saveArgumentCommentOnIPFSResult,
        });
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.ERROR, error: e.message },
          },
        ]);
      }
    };

    await handleSaveArgumentCommentOnIPFS(data);
  };

  return (
    <>
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

      <TransactionProgressModal
        subject={`${
          operation === UpsertFormOperation.CREATE
            ? "Add Comment to"
            : "Update Comment of"
        } Argument NFT`}
        open={isTransactionProgressModalOpen}
        steps={transactionProgressModalSteps}
        onClose={handleTransactionProgressModalClose}
        onComplete={handleTransactionProgressModalComplete}
      />
    </>
  );
};
