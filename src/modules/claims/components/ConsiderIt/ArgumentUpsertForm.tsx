import { FC, useRef } from "react";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";
import { filter, findIndex } from "lodash-es";
import { useRouter } from "next/router";

import {
  Autocomplete,
  AutocompleteOptionProps,
} from "common/components/Autocomplete";
import { registerMui } from "common/utils/registerMui";
import {
  ArgumentProps,
  ArgumentSides,
  KnowledgeBitProps,
  KnowledgeBitSides,
} from "modules/claims/interfaces";
import { UpsertFormOperation } from "common/interfaces";
import { mapArray } from "common/utils/mapArray";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useKnowledgeBits } from "modules/claims/hooks/useKnowledgeBits";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import {
  TransactionProgressModal,
  TransactionStep,
  TransactionStepOperation,
  TransactionStepStatus,
} from "common/components/TransactionProgressModal";
import { useClaims } from "modules/claims/hooks/useClaims";

const ArgumentUpsertFormOperationTexts = {
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

interface ArgumentUpsertFormDataProps {
  summary: string;
  evidences: string[];
}

interface ArgumentUpsertFormProps {
  argument: ArgumentProps;
  handleClose: () => any;
  operation: UpsertFormOperation;
}

const DEFAULT_KNOWLEDGE_BIT_NFT_MINT_TRANSACTION_STEPS = [
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

export const ArgumentUpsertForm: FC<ArgumentUpsertFormProps> = ({
  argument,
  operation,
  handleClose,
}) => {
  const {
    createArgument,
    updateArgument,
    setArguments,
    argumentsList,
    saveArgumentOnIPFS,
    mintArgumentNFT,
    updateArgumentNFTMetadata,
  } = useArguments();
  const { claim } = useClaims();
  const { addArgumentToOpinion } = useOpinions();
  const { enqueueSnackbar } = useSnackbar();
  const { knowledgeBits } = useKnowledgeBits();
  const router = useRouter();
  const { slug: claimSlug }: { slug?: string } = router.query;
  const [isTransactionProgressModalOpen, setIsTransactionProgressModalOpen] =
    useState(false);
  const [transactionProgressModalSteps, setTransactionProgressModalSteps] =
    useState(DEFAULT_KNOWLEDGE_BIT_NFT_MINT_TRANSACTION_STEPS);
  const transactionProgressModalStepsRef = useRef<TransactionStep[]>([]);
  const {
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<ArgumentUpsertFormDataProps>({
    defaultValues: argumentFormDefaultValues,
  });

  const [evidencesOptions, setEvidencesOptions] = useState<
    AutocompleteOptionProps[]
  >([]);

  // const handleSubmit = async (data: ArgumentUpsertFormDataProps) => {
  //   const mapArgument = () => ({
  //     summary: data.summary,
  //     side: argument.side,
  //     evidences: mapArray(data.evidences, ["id"]),
  //   });

  //   try {
  //     if (operation === UpsertFormOperation.CREATE) {
  //       const addedArgument = await createArgument({
  //         claimSlug,
  //         argument: mapArgument(),
  //       });
  //       addArgumentToOpinion(addedArgument);
  //       setArguments([...argumentsList, addedArgument]);
  //     } else {
  //       await updateArgument({
  //         id: argument?.id as string,
  //         argument: mapArgument(),
  //       });
  //     }
  //     enqueueSnackbar(
  //       ArgumentUpsertFormOperationTexts[operation].successFeedback,
  //       {
  //         variant: "success",
  //       }
  //     );
  //     reset(argumentFormDefaultValues);
  //     handleClose();
  //   } catch (e: any) {
  //     enqueueSnackbar(e?.message, {
  //       variant: "error",
  //     });
  //   }
  // };

  const handleTransactionProgressModalClose = () => {
    setIsTransactionProgressModalOpen(false);
  };

  const handleTransactionProgressModalComplete = () => {
    reset(argumentFormDefaultValues);
    handleClose();
  };

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

  const handleSubmit = async (data: ArgumentUpsertFormDataProps) => {
    const handleIndexArgumentNFT = async (transactionData: {
      nftMetadataURI: string;
      nftTxHash?: string;
      nftTokenId?: string;
    }) => {
      handleTransactionProgressUpdate([
        {
          operation: TransactionStepOperation.INDEX,
          update: { status: TransactionStepStatus.STARTED },
        },
      ]);

      const getArgument = () => ({
        summary: data.summary,
        side: argument.side,
        evidences: mapArray(data.evidences, ["id"]),
      });

      try {
        if (operation === UpsertFormOperation.CREATE) {
          const addedArgument = await createArgument({
            claimSlug,
            argument: {
              ...getArgument(),
              ...transactionData,
            },
          });
          addArgumentToOpinion(addedArgument);
          setArguments([...argumentsList, addedArgument]);
        } else {
          await updateArgument({
            id: argument?.id as string,
            argument: {
              ...getArgument(),
              ...transactionData,
            },
          });
        }

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

    const handleMintArgumentNFT = async ({
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
          const mintArgumentNFTTx = await mintArgumentNFT({
            metadataURI,
            knowledgeBitIds: [],
            claimTokenId: claim.nftTokenId,
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
          const tokenId = String(parseInt(transferEventTopics[3]));

          await handleIndexArgumentNFT({
            nftMetadataURI: metadataURI,
            nftTxHash: mintArgumentNFTTx.hash,
            nftTokenId: tokenId,
          });
        } else {
          const updateKnowledgeBitNFTMetadataTx =
            await updateArgumentNFTMetadata({
              metadataURI,
              nftTokenId: knowledgeBit?.nftTokenId as string,
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
                txHash: updateKnowledgeBitNFTMetadataTx.hash,
              },
            },
          ]);

          await updateKnowledgeBitNFTMetadataTx.wait();

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
          ]);

          // await handleIndexKnowledgeBitNFT({
          //   ...(fileURI ? { fileURI } : {}),
          //   nftMetadataURI: metadataURI,
          // });
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

    const handleSaveArgumentOnIPFS = async (data: KnowledgeBitProps) => {
      setTransactionProgressModalSteps(
        DEFAULT_KNOWLEDGE_BIT_NFT_MINT_TRANSACTION_STEPS
      );
      setIsTransactionProgressModalOpen(true);

      try {
        const saveArgumentOnIPFSResult = await saveArgumentOnIPFS({
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

        await handleMintArgumentNFT({ metadataURI: saveArgumentOnIPFSResult });
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.ERROR, error: e.message },
          },
        ]);
      }
    };

    await handleSaveArgumentOnIPFS(data);
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
    <>
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
              {ArgumentUpsertFormOperationTexts[operation].submitButton}
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
