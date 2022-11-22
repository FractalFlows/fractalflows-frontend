import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import { Link } from "./Link";

export enum TransactionStepStatus {
  UNSTARTED,
  STARTED,
  SUCCESS,
  ERROR,
}

export enum TransactionStepOperation {
  UPLOAD = "Uploading data to IPFS",
  SIGN = "Signing transaction with wallet",
  WAIT_ONCHAIN = "Waiting for transaction to complete on-chain",
  INDEX = "Indexing transaction data",
}

export interface TransactionStep {
  status: TransactionStepStatus;
  operation: TransactionStepOperation;
  retry?: () => any;
}

export const TransactionProgressModal = ({
  open = false,
  subject = "",
  steps = [],
  onClose = () => {},
  onComplete = () => {},
}: {
  open: boolean;
  subject?: string;
  steps?: TransactionStep[];
  onClose?: () => any;
  onComplete?: () => any;
}) => {
  const theme = useTheme();
  const [_isDialogOpen, _setIsDialogOpen] = useState<boolean>(open);

  const handleDialogClose = () => {
    _setIsDialogOpen(false);
    onClose();
  };
  const handleDialogBackdropClick = (event) => {
    event.stopPropagation();
    return false;
  };
  const handleDoneClick = () => {
    handleDialogClose();
    onComplete();
  };

  //   const handleEthereumSignIn = async (values?: WalletNoticeFormProps) => {
  //     handleSignInDialogClose();

  //     if (values?.dontShowNoticeAgain) {
  //       localStorage.setItem("dontShowNewToWalletNoticeAgain", "true");
  //     }

  //     try {
  //       await signInWithEthereum(signInCallback);
  //     } catch (e) {
  //       enqueueSnackbar(e?.message || e, {
  //         variant: "error",
  //       });
  //     }
  //   };

  //   useEffect(() => {
  //     if (
  //       isSignInDialogOpen &&
  //       localStorage.getItem("dontShowNewToWalletNoticeAgain") === "true"
  //     ) {
  //       handleEthereumSignIn();
  //     } else {
  //       _setIsSignInDialogOpen(isSignInDialogOpen);
  //     }
  //   }, [isSignInDialogOpen]);

  const getStepStatusIcon = (status: TransactionStepStatus) => {
    const iconSize = 15;
    const commonIconStyles = {
      borderRadius: 7.5,
      height: iconSize,
      width: iconSize,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    switch (status) {
      case TransactionStepStatus.UNSTARTED:
      default:
        return (
          <Box
            sx={{
              ...commonIconStyles,
              bgcolor: grey[200],
            }}
          />
        );
      case TransactionStepStatus.STARTED:
        return <CircularProgress size={iconSize} />;

      case TransactionStepStatus.SUCCESS:
        return (
          <Box
            sx={{
              ...commonIconStyles,
              bgcolor: theme.palette.success.main,
            }}
          >
            <DoneIcon sx={{ fontSize: iconSize * 0.8, color: "white" }} />
          </Box>
        );

      case TransactionStepStatus.ERROR:
        return (
          <Box
            sx={{
              ...commonIconStyles,
              bgcolor: theme.palette.error.main,
            }}
          >
            <ClearIcon sx={{ fontSize: iconSize * 0.8, color: "white" }} />
          </Box>
        );
    }
  };

  useEffect(() => {
    _setIsDialogOpen(open);
  }, [open]);

  return (
    <>
      <Dialog
        open={_isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        onBackdropClick={handleDialogBackdropClick}
        disableEscapeKeyDown
        maxWidth="sm"
        aria-labelledby="signin-dialog-title"
      >
        <DialogContent sx={{ paddingTop: 6, paddingBottom: 8 }}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h1" align="center">
                Network transaction
              </Typography>
              <Typography variant="body1" align="center">
                {subject}
              </Typography>
            </Stack>
            <Stack
              sx={{
                alignSelf: { xs: "initial", sm: "center" },
                width: { xs: "initial", sm: "350px" },
              }}
            >
              {steps.map(({ status, operation, retry }, i) => (
                <>
                  <Stack
                    key={operation}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    {getStepStatusIcon(status)}
                    <Typography>{operation}</Typography>
                    {status === TransactionStepStatus.ERROR && retry ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={retry}
                        size="small"
                        sx={{
                          marginLeft: 1,
                        }}
                      >
                        Try again
                      </Button>
                    ) : null}
                  </Stack>
                  {i === steps.length - 1 ? null : (
                    <Stack key={`${operation}-divider`}>
                      <Box
                        sx={{
                          bgcolor: grey[200],
                          width: "2px",
                          height: 10,
                          marginY: "5px",
                          marginLeft: "6.5px",
                        }}
                      />
                    </Stack>
                  )}
                </>
              ))}
              <Button
                sx={{ marginTop: 4 }}
                variant="contained"
                color="primary"
                disabled={
                  steps[steps.length - 1].status !==
                  TransactionStepStatus.SUCCESS
                }
                onClick={handleDoneClick}
              >
                Done
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
