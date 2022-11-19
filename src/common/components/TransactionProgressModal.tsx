import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import {
  Box,
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
  INDEX = "Indexing transaction data",
}

export interface TransactionStep {
  status: TransactionStepStatus;
  operation: TransactionStepOperation;
}

export const TransactionProgressModal = ({
  steps = [],
}: {
  steps?: TransactionStep[];
}) => {
  const theme = useTheme();
  //   const { isSignInDialogOpen, setIsSignInDialogOpen } = useApp();
  //   const [_isSignInDialogOpen, _setIsSignInDialogOpen] =
  //     useState(isSignInDialogOpen);
  //   const { signInWithEthereum } = useAuth();
  //   const { control, handleSubmit: handleSubmitHook } =
  //     useForm<WalletNoticeFormProps>({
  //       defaultValues: {
  //         dontShowNoticeAgain: false,
  //       },
  //     });
  //   const { enqueueSnackbar } = useSnackbar();

  //   const signInCallback = () => {
  //     AppCache.signInCallback && AppCache.signInCallback();
  //     AppCache.signInCallback = () => {};
  //   };
  //   const handleSignInDialogClose = () => {
  //     setIsSignInDialogOpen(false);
  //   };

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

  return (
    <>
      <Dialog
        // open={_isSignInDialogOpen}
        open={true}
        // onClose={handleSignInDialogClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="signin-dialog-title"
      >
        <DialogContent sx={{ paddingTop: 6, paddingBottom: 8 }}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h1" align="center">
                Network transaction
              </Typography>
              <Typography variant="body1" align="center"></Typography>
            </Stack>
            <Stack
              sx={{
                alignSelf: { xs: "initial", sm: "center" },
                width: { xs: "initial", sm: "350px" },
              }}
              // spacing={1}
            >
              {steps.map(({ status, operation }, i) => (
                <>
                  <Stack
                    key={operation}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    {getStepStatusIcon(status)}
                    <Typography>{operation}</Typography>
                  </Stack>
                  {i === steps.length - 1 ? null : (
                    <Stack>
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
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
