import { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";
import { useAuth } from "modules/auth/hooks/useAuth";

enum Web3ConnectionState {
  CONNECTING,
}

export const Web3Connection = () => {
  const { session } = useAuth();
  const { ethAddress } = session.user;
  const [web3ConnectionState, setWeb3ConnectionState] =
    useState<Web3ConnectionState>();
  const { connectEthereumWallet } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const handleConnectWalletClick = async () => {
    setWeb3ConnectionState(Web3ConnectionState.CONNECTING);

    try {
      await connectEthereumWallet();
      enqueueSnackbar("Your Ethereum wallet has been succesfully connected!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e.message || e, {
        variant: "error",
      });
    } finally {
      setWeb3ConnectionState(undefined);
    }
  };

  return (
    <TabPanel
      title="Web3 Connection"
      description="Use your Ethereum wallet to sign in and access token-based features"
    >
      <Stack spacing={3}>
        {ethAddress ? (
          <form>
            <TextField
              value={ethAddress}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckIcon color="success" />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        ) : (
          <LoadingButton
            loading={web3ConnectionState === Web3ConnectionState.CONNECTING}
            variant="contained"
            size="large"
            onClick={handleConnectWalletClick}
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            Connect wallet
          </LoadingButton>
        )}
      </Stack>
    </TabPanel>
  );
};
