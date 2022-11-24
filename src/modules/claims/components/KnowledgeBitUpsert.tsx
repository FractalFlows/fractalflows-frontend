import { FC, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray, NestedValue } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { findIndex, get, isEmpty } from "lodash-es";

import { Select } from "common/components/Select";
import {
  AttributionOrigins,
  AttributionProps,
  KnowledgeBitProps,
  KnowledgeBitSides,
  KnowledgeBitTypes,
  KnowledgeBitTypesLabels,
} from "modules/claims/interfaces";
import { validateEmail, validateTwitterHandle } from "common/utils/validate";
import { registerMui } from "common/utils/registerMui";
import { mapArray } from "common/utils/mapArray";
import { useKnowledgeBits } from "modules/claims/hooks/useKnowledgeBits";
import { FileInput } from "common/components/FileInput";
import { Link } from "common/components/Link";
import {
  TransactionProgressModal,
  TransactionStep,
  TransactionStepOperation,
  TransactionStepStatus,
} from "common/components/TransactionProgressModal";
import { useClaims } from "../hooks/useClaims";
import {
  getFilenameFromIPFSURI,
  getGatewayFromIPFSURI,
} from "common/utils/ipfs";

const knowledgeBitTypesOptions = Object.keys(KnowledgeBitTypes).map((key) => ({
  value: key,
  label: KnowledgeBitTypesLabels[key],
}));

const KnowledgeBitAttributionOrigins = [
  { value: AttributionOrigins.TWITTER, label: "Twitter" },
  { value: AttributionOrigins.EMAIL, label: "Email" },
];

export enum KnowledgeBitUpsertFormOperation {
  CREATE,
  UPDATE,
}

const KnowledgeBitUpsertFormOperationText = {
  [KnowledgeBitUpsertFormOperation.CREATE]: {
    formTitle: "Add knowledge bit",
    submitButton: "Add knowledge bit",
    successFeedback: "Your new knowledge bit has been succesfully added!",
  },
  [KnowledgeBitUpsertFormOperation.UPDATE]: {
    formTitle: "Edit knowledge bit",
    submitButton: "Edit knowledge bit",
    successFeedback: "Your knowledge bit has been succesfully edited!",
  },
};

interface KnowledgeBitUpsertProps {
  knowledgeBit?: KnowledgeBitProps;
  handleClose: () => any;
  operation?: KnowledgeBitUpsertFormOperation;
}

interface KnowledgeBitUpsertFormProps {
  name: string;
  summary?: string;
  side: KnowledgeBitSides;
  type: string;
  customType?: string;
  file: File[];
  attributions: NestedValue<AttributionProps[]>;
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

export const KnowledgeBitUpsert: FC<KnowledgeBitUpsertProps> = ({
  knowledgeBit,
  handleClose,
  operation = KnowledgeBitUpsertFormOperation.CREATE,
}) => {
  const { claim } = useClaims();
  const {
    saveKnowledgeBitOnIPFS,
    mintKnowledgeBitNFT,
    updateKnowledgeBitNFTMetadata,
    createKnowledgeBit,
    updateKnowledgeBit,
  } = useKnowledgeBits();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isTransactionProgressModalOpen, setIsTransactionProgressModalOpen] =
    useState(false);
  const [transactionProgressModalSteps, setTransactionProgressModalSteps] =
    useState(DEFAULT_KNOWLEDGE_BIT_NFT_MINT_TRANSACTION_STEPS);
  const transactionProgressModalStepsRef = useRef<TransactionStep[]>([]);
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<KnowledgeBitUpsertFormProps>({
    defaultValues: {
      name: get(knowledgeBit, "name", ""),
      summary: get(knowledgeBit, "summary", ""),
      side: get(knowledgeBit, "side"),
      type: get(knowledgeBit, "type", ""),
      customType: get(knowledgeBit, "customType", ""),
      file: undefined,
      attributions: mapArray(knowledgeBit?.attributions, [
        "id",
        "origin",
        "identifier",
      ]) as AttributionProps[],
    },
  });
  const {
    fields: attributionsFields,
    append: appendAttribution,
    remove: removeAttribution,
  } = useFieldArray({
    control,
    name: "attributions",
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
    handleClose();
  };

  const handleSubmit = async (data: KnowledgeBitProps) => {
    const { slug } = router.query;

    data.file = data.file[0];

    const handleIndexKnowledgeBitNFT = async (transactionData: {
      fileURI?: string;
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

      try {
        delete data.file;

        if (operation === KnowledgeBitUpsertFormOperation.CREATE) {
          await createKnowledgeBit({
            claimSlug: slug as string,
            knowledgeBit: { ...data, ...transactionData },
          });
        } else {
          await updateKnowledgeBit({
            id: knowledgeBit?.id as string,
            knowledgeBit: { ...data, ...transactionData },
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

    const handleMintKnowledgeBitNFT = async ({
      metadataURI,
      fileURI,
    }: {
      metadataURI: string;
      fileURI: string;
    }) => {
      handleTransactionProgressUpdate([
        {
          operation: TransactionStepOperation.SIGN,
          update: { status: TransactionStepStatus.STARTED },
        },
      ]);

      try {
        if (operation === KnowledgeBitUpsertFormOperation.CREATE) {
          const mintKnowledgeBitNFTTx = await mintKnowledgeBitNFT({
            metadataURI,
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
              },
            },
          ]);

          const mintKnowledgeBitNFTTxReceipt =
            await mintKnowledgeBitNFTTx.wait();

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
          ]);

          const { transactionHash } = mintKnowledgeBitNFTTxReceipt;
          const transferEventTopics =
            mintKnowledgeBitNFTTxReceipt.logs[0].topics;
          const tokenId = String(parseInt(transferEventTopics[3]));

          await handleIndexKnowledgeBitNFT({
            fileURI,
            nftMetadataURI: metadataURI,
            nftTxHash: transactionHash,
            nftTokenId: tokenId,
          });
        } else {
          const updateKnowledgeBitNFTMetadataTx =
            await updateKnowledgeBitNFTMetadata({
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

          console.log("fileURI", fileURI);

          await handleIndexKnowledgeBitNFT({
            ...(fileURI ? { fileURI } : {}),
            nftMetadataURI: metadataURI,
          });
        }
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.SIGN,
            update: {
              status: TransactionStepStatus.ERROR,
              error: e.message,
              retry: () => handleMintKnowledgeBitNFT({ metadataURI, fileURI }),
            },
          },
        ]);
      }
    };

    const handleSaveKnowledgeBitOnIPFS = async (data: KnowledgeBitProps) => {
      setTransactionProgressModalSteps(
        DEFAULT_KNOWLEDGE_BIT_NFT_MINT_TRANSACTION_STEPS
      );
      setIsTransactionProgressModalOpen(true);

      try {
        const saveKnowledgeBitOnIPFSResult = await saveKnowledgeBitOnIPFS({
          knowledgeBit: data,
        });

        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.SUCCESS },
          },
        ]);

        await handleMintKnowledgeBitNFT(saveKnowledgeBitOnIPFSResult);
      } catch (e: any) {
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.ERROR, error: e.message },
          },
        ]);
      }
    };

    await handleSaveKnowledgeBitOnIPFS(data);
  };

  const knowledgeBitType = watch("type");

  return (
    <Stack alignItems="center" spacing={3}>
      <Typography variant="h5">
        {KnowledgeBitUpsertFormOperationText[operation].formTitle}
      </Typography>
      <form onSubmit={handleSubmitHook(handleSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            fullWidth
            {...registerMui({
              register,
              name: "name",
              props: {
                required: true,
              },
              errors,
            })}
          ></TextField>
          <TextField
            label="Summary (optional)"
            multiline
            minRows={4}
            maxRows={Infinity}
            fullWidth
            {...registerMui({
              register,
              name: "summary",
              errors,
            })}
          ></TextField>
          <Select
            label="Type"
            name="type"
            fullWidth
            options={knowledgeBitTypesOptions}
            control={control}
            errors={errors}
            rules={{
              required: true,
              deps: ["customType"],
            }}
          />
          {knowledgeBitType === KnowledgeBitTypes.OTHER ? (
            <TextField
              label="Other type"
              fullWidth
              {...registerMui({
                register,
                name: "customType",
                props: {
                  validate: {
                    required: (customType) =>
                      knowledgeBitType === KnowledgeBitTypes.OTHER &&
                      isEmpty(customType) === false,
                  },
                },
                errors,
              })}
            ></TextField>
          ) : null}

          {operation === KnowledgeBitUpsertFormOperation.UPDATE ? (
            <div>
              <Typography variant="body1">
                Current file:{" "}
                <Link
                  href={getGatewayFromIPFSURI(knowledgeBit?.fileURI)}
                  text
                  blank
                >
                  {getFilenameFromIPFSURI(knowledgeBit?.fileURI)}
                </Link>
              </Typography>
            </div>
          ) : null}

          <Stack direction="row" alignItems="center">
            {operation === KnowledgeBitUpsertFormOperation.UPDATE ? (
              <Typography variant="body1">New file:&nbsp;</Typography>
            ) : null}
            <FileInput
              name="file"
              register={register}
              control={control}
              errors={errors}
              rules={{
                required: operation === KnowledgeBitUpsertFormOperation.CREATE,
              }}
            />
          </Stack>

          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Attributions
              </Typography>
              <Typography variant="body2">
                Add an e-mail or Twitter handle profile link to the original
                knowledge bit owner.
              </Typography>
            </Box>
            {attributionsFields.map(
              (attributionsField, attributionsFieldIndex) => {
                const origin: string = watch(
                  `attributions.${attributionsFieldIndex}.origin`
                );
                const DeleteAttributionButton = ({ display }: any) => (
                  <Box sx={{ display }}>
                    <IconButton
                      size="medium"
                      aria-label="Delete attribution"
                      component="span"
                      onClick={() => removeAttribution(attributionsFieldIndex)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </Box>
                );

                return (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    key={attributionsField.id}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      flexGrow={1}
                    >
                      <Select
                        label="Origin"
                        name={`attributions.${attributionsFieldIndex}.origin`}
                        fullWidth
                        sx={{ width: { xs: "unset", sm: 150 } }}
                        options={KnowledgeBitAttributionOrigins}
                        control={control}
                        errors={errors}
                        rules={{
                          required: true,
                          deps: [
                            `attributions.${attributionsFieldIndex}.identifier`,
                          ],
                        }}
                      />

                      <TextField
                        label={origin === "twitter" ? "Handle" : "Email"}
                        sx={{ flexGrow: 1 }}
                        {...registerMui({
                          register,
                          name: `attributions.${attributionsFieldIndex}.identifier`,
                          props: {
                            required: true,
                            validate: {
                              email: (identifier: string) =>
                                origin === "email"
                                  ? validateEmail(identifier)
                                  : true,
                              twitterHandle: (identifier: string) =>
                                origin === "twitter"
                                  ? validateTwitterHandle(identifier)
                                  : true,
                            },
                          },
                          errors,
                        })}
                      ></TextField>
                      <DeleteAttributionButton
                        display={{ xs: "none", sm: "flex" }}
                      />
                    </Stack>
                    <DeleteAttributionButton
                      display={{ xs: "flex", sm: "none" }}
                    />
                  </Stack>
                );
              }
            )}
            <Button
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              onClick={() =>
                appendAttribution({ origin: "twitter", identifier: "" })
              }
            >
              Add attribution
            </Button>
          </Stack>
          <Stack spacing={2}>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              size="large"
            >
              {KnowledgeBitUpsertFormOperationText[operation].submitButton}
            </LoadingButton>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              size="large"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>

      <TransactionProgressModal
        subject={`${
          KnowledgeBitUpsertFormOperation.CREATE ? "Mint" : "Update"
        } Knowledge Bit NFT`}
        open={isTransactionProgressModalOpen}
        steps={transactionProgressModalSteps}
        onClose={handleTransactionProgressModalClose}
        onComplete={handleTransactionProgressModalComplete}
      />
    </Stack>
  );
};
