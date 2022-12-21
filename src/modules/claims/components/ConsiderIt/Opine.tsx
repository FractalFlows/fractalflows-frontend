import { DragEvent, FC, SyntheticEvent, useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { OpineColumn } from "./OpineColumn";
import styles from "./Opine.module.css";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { LoadingButton } from "@mui/lab";
import {
  DEFAULT_NFT_MINT_TRANSACTION_STEPS,
  TransactionProgressModal,
  TransactionStep,
  TransactionStepOperation,
  TransactionStepStatus,
} from "common/components/TransactionProgressModal";
import { findIndex, isEmpty } from "lodash-es";
import { useClaims } from "modules/claims/hooks/useClaims";
import { getGatewayFromIPFSURI } from "common/utils/ipfs";
import { Link } from "common/components/Link";

export const Opine: FC = () => {
  const {
    setIsOpining,
    userOpinion,
    addArgumentToOpinion,
    saveOpinion,
    saveOpinionOnIPFS,
    mintOpinionNFT,
    updateOpinionNFTMetadata,
  } = useOpinions();
  const { claim } = useClaims();
  const [isSavingOpinion, setIsSavingOpinion] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isTransactionProgressModalOpen, setIsTransactionProgressModalOpen] =
    useState(false);
  const [transactionProgressModalSteps, setTransactionProgressModalSteps] =
    useState(DEFAULT_NFT_MINT_TRANSACTION_STEPS);
  const transactionProgressModalStepsRef = useRef<TransactionStep[]>([]);

  const handleDrop = (event: DragEvent) => {
    setIsDraggingOver(false);
    const argument = JSON.parse(event.dataTransfer.getData("argument"));
    addArgumentToOpinion(argument);
  };
  const handleDragOver = (event: SyntheticEvent) => {
    event.preventDefault();
  };
  const handleDragEnter = () => {
    setIsDraggingOver(true);
  };
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleTransactionProgressModalClose = () => {
    setIsTransactionProgressModalOpen(false);
    setIsSavingOpinion(false);
  };

  const handleTransactionProgressModalComplete = () => {
    setIsSavingOpinion(false);
    setIsOpining(false);
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

  const handleSaveOpinion = async () => {
    setIsSavingOpinion(true);

    const handleIndexOpinionNFT = async (transactionData: {
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
        await saveOpinion({ opinion: { ...userOpinion, ...transactionData } });

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

    const handleMintOpinionNFT = async ({
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
        if (isEmpty(userOpinion.nftTokenId)) {
          const mintOpinionNFTTx = await mintOpinionNFT({
            metadataURI,
            argumentTokenIds: userOpinion.arguments.map(
              ({ nftTokenId }) => nftTokenId
            ),
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
                txHash: mintOpinionNFTTx.hash,
              },
            },
          ]);

          const mintOpinionNFTTxReceipt = await mintOpinionNFTTx.wait();

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
          ]);

          const transferEventTopics = mintOpinionNFTTxReceipt.logs[0].topics;
          const nftTokenId = String(parseInt(transferEventTopics[3]));

          await handleIndexOpinionNFT({
            nftMetadataURI: metadataURI,
            nftTxHash: mintOpinionNFTTx.hash,
            nftTokenId,
          });
        } else {
          const updateOpinionNFTMetadataTx = await updateOpinionNFTMetadata({
            metadataURI,
            argumentTokenIds: userOpinion.arguments.map(
              ({ nftTokenId }) => nftTokenId
            ),
            nftTokenId: userOpinion?.nftTokenId as string,
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
                txHash: updateOpinionNFTMetadataTx.hash,
              },
            },
          ]);

          await updateOpinionNFTMetadataTx.wait();

          handleTransactionProgressUpdate([
            {
              operation: TransactionStepOperation.WAIT_ONCHAIN,
              update: {
                status: TransactionStepStatus.SUCCESS,
              },
            },
          ]);

          await handleIndexOpinionNFT({
            nftMetadataURI: metadataURI,
          });
        }
      } catch (e: any) {
        setIsSavingOpinion(false);
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.SIGN,
            update: {
              status: TransactionStepStatus.ERROR,
              error: e.message,
              retry: () => handleMintOpinionNFT({ metadataURI }),
            },
          },
        ]);
      }
    };

    const handleSaveOpinionOnIPFS = async (data) => {
      setTransactionProgressModalSteps(DEFAULT_NFT_MINT_TRANSACTION_STEPS);
      setIsTransactionProgressModalOpen(true);

      try {
        const saveOpinionOnIPFSResult = await saveOpinionOnIPFS({
          opinion: {
            acceptance: userOpinion.acceptance,
          },
        });

        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.SUCCESS },
          },
        ]);

        await handleMintOpinionNFT({
          metadataURI: saveOpinionOnIPFSResult,
        });
      } catch (e: any) {
        setIsSavingOpinion(false);
        handleTransactionProgressUpdate([
          {
            operation: TransactionStepOperation.UPLOAD,
            update: { status: TransactionStepStatus.ERROR, error: e.message },
          },
        ]);
      }
    };

    await handleSaveOpinionOnIPFS(userOpinion);
  };

  return (
    // This extra wrapper is necessary to give the sticky position room to move
    <Box className={styles.opine}>
      <Stack spacing={2} sx={{ position: "sticky", top: "20px" }}>
        <Paper
          variant="outlined"
          sx={{
            width: { xs: "100%", md: 700 },
            p: 3,
            paddingBottom: 8,
            borderStyle: isDraggingOver ? "solid" : "dashed",
            backgroundColor: isDraggingOver ? "#f5f5f5" : "",
            borderRadius: "10px",
            borderWidth: 3,
          }}
          className={isDraggingOver ? styles.opine__droparea : ""}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div className={styles.opine__grid}>
            <Typography variant="h5">Give your arguments against</Typography>
            <OpineColumn side={ArgumentSides.CON} />
            <Typography variant="h5">Give your arguments for</Typography>
            <OpineColumn side={ArgumentSides.PRO} />
          </div>
        </Paper>

        {isEmpty(userOpinion.nftTokenId) ? null : (
          <Stack spacing={3} direction="row" justifyContent="center">
            <Typography variant="body2">
              Token ID:&nbsp;
              <Link
                href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/token/${process.env.NEXT_PUBLIC_OPINION_CONTRACT_ADDRESS}?a=${userOpinion?.nftTokenId}`}
                text
                blank
              >
                {userOpinion?.nftTokenId}
              </Link>
            </Typography>
            <Typography variant="body2">
              Metadata:&nbsp;
              <Link
                href={getGatewayFromIPFSURI(userOpinion?.nftMetadataURI)}
                text
                blank
              >
                IPFS
              </Link>
            </Typography>
          </Stack>
        )}

        <LoadingButton
          loading={isSavingOpinion}
          variant="contained"
          size="large"
          onClick={handleSaveOpinion}
        >
          Save opinion
        </LoadingButton>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => setIsOpining(false)}
        >
          Skip to results
        </Button>
      </Stack>

      <TransactionProgressModal
        subject={`${
          isEmpty(userOpinion?.nftTokenId) ? "Mint" : "Update"
        } Opinion NFT`}
        open={isTransactionProgressModalOpen}
        steps={transactionProgressModalSteps}
        onClose={handleTransactionProgressModalClose}
        onComplete={handleTransactionProgressModalComplete}
      />
    </Box>
  );
};
