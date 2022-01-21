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
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";
import { APIKeyProps } from "../interfaces";
import { isEmpty } from "lodash-es";

enum APIKeyState {
  GENERATING,
  SUCCESFULLY_GENERATED,
  REMOVING,
}

enum CopyAPIKeyTooltipTextState {
  COPY = "Copy to clipboard",
  COPIED = "Copied!",
}

export const APIKeys = () => {
  const [apiKey, setAPIKey] = useState<APIKeyProps>();
  const [apiKeyState, setAPIKeyState] = useState<APIKeyState>();
  const [copyAPIKeyTooltipText, setCopyAPIKeyTooltipText] =
    useState<CopyAPIKeyTooltipTextState>(CopyAPIKeyTooltipTextState.COPY);
  const { getAPIKey, createAPIKey, removeAPIKey } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateAPIKeyClick = async () => {
    setAPIKeyState(APIKeyState.GENERATING);
    enqueueSnackbar(`Generating ${apiKey ? "new" : ""} API Key...`, {
      variant: "info",
    });

    try {
      const newApiKey = await createAPIKey();
      setAPIKey(newApiKey);
      setAPIKeyState(APIKeyState.SUCCESFULLY_GENERATED);
      enqueueSnackbar(
        `Your ${apiKey ? "new" : ""} API Key has been succesfully generated!`,
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

  const handleRemoveAPIKeyClick = async () => {
    setAPIKeyState(APIKeyState.REMOVING);
    enqueueSnackbar("Removing your API Key...", {
      variant: "info",
    });

    try {
      await removeAPIKey();
      setAPIKey(undefined);
      enqueueSnackbar("Your API Key has been succesfully removed!", {
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
            loading={apiKeyState === APIKeyState.GENERATING}
            variant="contained"
            size="large"
            onClick={handleCreateAPIKeyClick}
            sx={{ alignSelf: { xs: "initial", sm: "start" } }}
          >
            Generate {apiKey ? "new" : ""} API Key
          </LoadingButton>
          {apiKey ? (
            <LoadingButton
              loading={apiKeyState === APIKeyState.REMOVING}
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleRemoveAPIKeyClick}
              sx={{ alignSelf: { xs: "initial", sm: "start" } }}
            >
              Remove API Key
            </LoadingButton>
          ) : null}
        </Stack>
      </Stack>
    </TabPanel>
  );
};
