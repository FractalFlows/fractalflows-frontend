import { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Button,
  Link as MuiLink,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopyIcon";
import Launch from "@mui/icons-material/LaunchIcon";

import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";
import { APIKeyProps } from "../interfaces";
import { isEmpty } from "lodash-es";
import { Spinner } from "common/components/Spinner";

enum APIKeyState {
  GENERATING,
  SUCCESFULLY_GENERATED,
  DELETING,
}

enum CopyAPIKeyTooltipTextState {
  COPY = "Copy to clipboard",
  COPIED = "Copied!",
}

export const APIKeys = () => {
  const [apiKey, setAPIKey] = useState<APIKeyProps>();
  const [apiKeyState, setAPIKeyState] = useState<APIKeyState>();
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [copyAPIKeyTooltipText, setCopyAPIKeyTooltipText] =
    useState<CopyAPIKeyTooltipTextState>(CopyAPIKeyTooltipTextState.COPY);
  const { getAPIKey, createAPIKey, removeAPIKey } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = async () => {
    setAPIKeyState(APIKeyState.GENERATING);

    try {
      const newApiKey = await createAPIKey();
      setAPIKey(newApiKey);
      setAPIKeyState(APIKeyState.SUCCESFULLY_GENERATED);
      setIsRegenerateDialogOpen(false);
      enqueueSnackbar(
        `Your API Key has been succesfully ${
          apiKey ? "regenerated" : "generated"
        }!`,
        {
          variant: "success",
        }
      );
    } catch (e: any) {
      setAPIKeyState(undefined);
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    }
  };
  const handleRegenerateDialogClose = () => setIsRegenerateDialogOpen(false);
  const handleDelete = async () => {
    setAPIKeyState(APIKeyState.DELETING);

    try {
      await removeAPIKey();
      setAPIKey(undefined);
      setIsDeleteDialogOpen(false);
      enqueueSnackbar("Your API Key has been succesfully deleted!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setAPIKeyState(undefined);
    }
  };
  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);

  const handleCopyAPIKeyClick = (text: string = "") => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyAPIKeyTooltipText(CopyAPIKeyTooltipTextState.COPIED);
      },
      () =>
        enqueueSnackbar("Unable to write to clipboard", {
          variant: "error",
        })
    );
  };

  const handleCopyAPIKeyMouseLeave = () => {
    setTimeout(() => {
      setCopyAPIKeyTooltipText(CopyAPIKeyTooltipTextState.COPY);
    }, 200);
  };

  useEffect(() => {
    getAPIKey()
      .then((key) => {
        setAPIKey(
          key
            ? {
                key,
                secret: "********************************",
              }
            : undefined
        );
      })
      .catch((e: any) =>
        enqueueSnackbar(e?.message, {
          variant: "error",
        })
      );
  }, []);

  return (
    <TabPanel
      title="API Keys"
      description={
        <>
          Place your API Key in the <code>fractalflows-api-key</code> and your
          API Secret in the <code>fractalflows-api-secret</code> HTTP headers to
          authenticate.
          <br />
          <MuiLink
            href="https://server.fractalflows.com/graphql"
            target="_blank"
            rel="noreferrer"
            sx={{ display: "block", mt: 1 }}
          >
            Checkout the API documentation <LaunchIcon fontSize="inherit" />
          </MuiLink>
        </>
      }
    >
      <Stack spacing={3}>
        {isEmpty(apiKey) ? null : (
          <form>
            <Stack spacing={3}>
              {apiKeyState === APIKeyState.SUCCESFULLY_GENERATED ? (
                <Alert severity="warning">
                  Save your API Secret in a safe place because it will never be
                  shown again!
                </Alert>
              ) : null}
              <TextField
                value={apiKey?.key}
                label="API Key"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment:
                    apiKeyState === APIKeyState.SUCCESFULLY_GENERATED ? (
                      <InputAdornment position="end">
                        <Tooltip
                          title={copyAPIKeyTooltipText}
                          onMouseLeave={handleCopyAPIKeyMouseLeave}
                        >
                          <IconButton
                            aria-label="Copy API Key to clipboard"
                            onClick={() => handleCopyAPIKeyClick(apiKey?.key)}
                            edge="end"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) : null,
                }}
              />
              <TextField
                value={apiKey?.secret}
                label="API Secret"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment:
                    apiKeyState === APIKeyState.SUCCESFULLY_GENERATED ? (
                      <InputAdornment position="end">
                        <Tooltip
                          title={copyAPIKeyTooltipText}
                          onMouseLeave={handleCopyAPIKeyMouseLeave}
                        >
                          <IconButton
                            aria-label="Copy API Secret to clipboard"
                            onClick={() =>
                              handleCopyAPIKeyClick(apiKey?.secret)
                            }
                            edge="end"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) : null,
                }}
              />
            </Stack>
          </form>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <LoadingButton
            loading={!apiKey && apiKeyState === APIKeyState.GENERATING}
            variant="contained"
            size="large"
            onClick={() =>
              apiKey ? setIsRegenerateDialogOpen(true) : handleCreate()
            }
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            {apiKey ? "Regenerate" : "Generate"} API Key
          </LoadingButton>
          {apiKey ? (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{ alignSelf: { xs: "initial", sm: "start" } }}
            >
              Delete API Key
            </Button>
          ) : null}
        </Stack>
      </Stack>

      <Dialog
        open={isRegenerateDialogOpen}
        onClose={handleRegenerateDialogClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="regenerate-api-key-dialog-title"
      >
        <DialogTitle id="regenerate-api-key-dialog-title">
          Regenerate API Key?
        </DialogTitle>
        {apiKeyState === APIKeyState.GENERATING ? (
          <Spinner />
        ) : (
          <DialogActions>
            <Button onClick={handleRegenerateDialogClose}>Cancel</Button>
            <Button onClick={handleCreate} autoFocus>
              Regenerate
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-api-key-dialog-title"
      >
        <DialogTitle id="delete-api-key-dialog-title">
          Delete API Key?
        </DialogTitle>
        {apiKeyState === APIKeyState.DELETING ? (
          <Spinner />
        ) : (
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </TabPanel>
  );
};
