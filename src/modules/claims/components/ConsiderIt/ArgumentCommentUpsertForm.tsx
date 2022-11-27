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
    saveArgumenCommentOnIPFS,
  } = useArgumentComments();
  const { enqueueSnackbar } = useSnackbar();
  const [isTransactionProgressModalOpen, setIsTransactionProgressModalOpen] =
    useState(false);
  const [transactionProgressModalSteps, setTransactionProgressModalSteps] =
    useState(DEFAULT_ARGUMENT_COMMENT_NFT_MINT_TRANSACTION_STEPS);
  const transactionProgressModalStepsRef = useRef<TransactionStep[]>([]);
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

  // const handleSubmit = async (data: ArgumentCommentUpsertFormDataProps) => {
  //   try {
  //     const savedArgumentComment = await (operation ===
  //     UpsertFormOperation.CREATE
  //       ? createArgumentComment({
  //           argumentComment: {
  //             content: data.content,
  //             argument: { id: get(argumentComment, "argument.id") },
  //           },
  //         })
  //       : updateArgumentComment({
  //           argumentComment: {
  //             id: get(argumentComment, "id"),
  //             content: data.content,
  //             argument: { id: get(argumentComment, "argument.id") },
  //           },
  //         }));
  //     enqueueSnackbar(
  //       ArgumentCommentUpsertFormOperationTexts[operation].successFeedback,
  //       {
  //         variant: "success",
  //       }
  //     );
  //     reset(argumentCommentFormDefaultValues);
  //     handleSuccess && handleSuccess(savedArgumentComment);
  //     handleClose && handleClose();
  //   } catch (e: any) {
  //     enqueueSnackbar(e?.message, {
  //       variant: "error",
  //     });
  //   }
  // };

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

  const handleSubmit = async (data: ArgumentCommentUpsertFormDataProps) => {
    // const handleIndexArgumentNFT = async (transactionData: {
    //   nftMetadataURI: string;
    //   nftTxHash?: string;
    //   nftTokenId?: string;
    // }) => {
    //   handleTransactionProgressUpdate([
    //     {
    //       operation: TransactionStepOperation.INDEX,
    //       update: { status: TransactionStepStatus.STARTED },
    //     },
    //   ]);

    //   const getArgument = () => ({
    //     summary: data.summary,
    //     side: argument.side,
    //     evidences: mapArray(data.evidences, ["id"]),
    //   });

    //   try {
    //     if (operation === UpsertFormOperation.CREATE) {
    //       const addedArgument = await createArgument({
    //         claimSlug,
    //         argument: {
    //           ...getArgument(),
    //           ...transactionData,
    //         },
    //       });
    //       addArgumentToOpinion(addedArgument);
    //       setArguments([...argumentsList, addedArgument]);
    //     }

    //     handleTransactionProgressUpdate([
    //       {
    //         operation: TransactionStepOperation.INDEX,
    //         update: { status: TransactionStepStatus.SUCCESS },
    //       },
    //     ]);
    //   } catch (e: any) {
    //     handleTransactionProgressUpdate([
    //       {
    //         operation: TransactionStepOperation.INDEX,
    //         update: { status: TransactionStepStatus.ERROR, error: e.message },
    //       },
    //     ]);
    //   }
    // };

    // const handleMintArgumentNFT = async ({
    //   metadataURI,
    // }: {
    //   metadataURI: string;
    // }) => {
    //   handleTransactionProgressUpdate([
    //     {
    //       operation: TransactionStepOperation.SIGN,
    //       update: { status: TransactionStepStatus.STARTED },
    //     },
    //   ]);

    //   try {
    //     if (operation === UpsertFormOperation.CREATE) {
    //       const mintArgumentNFTTx = await mintArgumentNFT({
    //         metadataURI,
    //         knowledgeBitIds: [],
    //         claimTokenId: claim.nftTokenId,
    //       });

    //       handleTransactionProgressUpdate([
    //         {
    //           operation: TransactionStepOperation.SIGN,
    //           update: {
    //             status: TransactionStepStatus.SUCCESS,
    //           },
    //         },
    //         {
    //           operation: TransactionStepOperation.WAIT_ONCHAIN,
    //           update: {
    //             status: TransactionStepStatus.STARTED,
    //             txHash: mintArgumentNFTTx.hash,
    //           },
    //         },
    //       ]);

    //       const mintArgumentNFTTxReceipt = await mintArgumentNFTTx.wait();

    //       handleTransactionProgressUpdate([
    //         {
    //           operation: TransactionStepOperation.WAIT_ONCHAIN,
    //           update: {
    //             status: TransactionStepStatus.SUCCESS,
    //           },
    //         },
    //       ]);

    //       const transferEventTopics = mintArgumentNFTTxReceipt.logs[0].topics;
    //       const tokenId = String(parseInt(transferEventTopics[3]));

    //       await handleIndexArgumentNFT({
    //         nftMetadataURI: metadataURI,
    //         nftTxHash: mintArgumentNFTTx.hash,
    //         nftTokenId: tokenId,
    //       });
    //     }
    //   } catch (e: any) {
    //     handleTransactionProgressUpdate([
    //       {
    //         operation: TransactionStepOperation.SIGN,
    //         update: {
    //           status: TransactionStepStatus.ERROR,
    //           error: e.message,
    //           retry: () => handleMintArgumentNFT({ metadataURI }),
    //         },
    //       },
    //     ]);
    //   }
    // };

    const handleSaveArgumentCommentOnIPFS = async (
      data: ArgumentCommentUpsertFormDataProps
    ) => {
      setTransactionProgressModalSteps(
        DEFAULT_ARGUMENT_COMMENT_NFT_MINT_TRANSACTION_STEPS
      );
      setIsTransactionProgressModalOpen(true);

      try {
        const saveArgumentCommentOnIPFSResult = await saveArgumenCommentOnIPFS({
          argument: {
            summary: data.summary,
            side: argument.side,
          },
        });

        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.SUCCESS },
          },
        ]);

        // await handleMintArgumentNFT({ metadataURI: saveArgumentOnIPFSResult });
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
          operation === UpsertFormOperation.CREATE ? "Mint" : "Update"
        } Argument NFT`}
        open={isTransactionProgressModalOpen}
        steps={transactionProgressModalSteps}
        onClose={handleTransactionProgressModalClose}
        onComplete={handleTransactionProgressModalComplete}
      />
    </>
  );
};
