import { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import { useSettings } from "../hooks/useSettings";
import { TabPanel } from "./TabPanel";

enum APIKeyState {
  GENERATING,
  REMOVING,
}

enum CopyAPIKeyTooltipTextState {
  COPY = "Copy to clipboard",
  COPIED = "Copied!",
}

export const APIKeys = () => {
  const [apiKey, setAPIKey] = useState<string>("");
  const [apiKeyState, setAPIKeyState] = useState<APIKeyState>();
  const [copyAPIKeyTooltipText, setCopyAPIKeyTooltipText] =
    useState<CopyAPIKeyTooltipTextState>(CopyAPIKeyTooltipTextState.COPY);
  const { getAPIKey, generateAPIKey, removeAPIKey } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const handleGenerateAPIKeyClick = async () => {
    setAPIKeyState(APIKeyState.GENERATING);
    enqueueSnackbar(`Generating ${apiKey ? "new" : ""} API Key...`, {
      variant: "info",
    });

    try {
      const newApiKey = await generateAPIKey();
      setAPIKey(newApiKey);
      enqueueSnackbar(
        `Your ${apiKey ? "new" : ""} API Key has been succesfully generated!`,
        {
          variant: "success",
        }
      );
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setAPIKeyState(undefined);
    }
  };

  const handleRemoveAPIKeyClick = async () => {
    setAPIKeyState(APIKeyState.REMOVING);
    enqueueSnackbar("Removing your API Key...", {
      variant: "info",
    });

    try {
      await removeAPIKey();
      setAPIKey("");
      enqueueSnackbar("Your API Key has been succesfully removed!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setAPIKeyState(undefined);
    }
  };

  const handleCopyAPIKeyClick = () => {
    navigator.clipboard.writeText(apiKey).then(
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
      .then((apiKey) => {
        console.log(apiKey);
        setAPIKey(apiKey);
      })
      .catch((e) =>
        enqueueSnackbar(e.message, {
          variant: "error",
        })
      );
  }, []);

  return (
    <TabPanel
      title="API Keys"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
    >
      <Stack spacing={3}>
        {apiKey ? (
          <form>
            <TextField
              id="filled-adornment-password"
              value={apiKey}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={copyAPIKeyTooltipText}
                      onMouseLeave={handleCopyAPIKeyMouseLeave}
                    >
                      <IconButton
                        aria-label="Copy API Key to clipboard"
                        onClick={handleCopyAPIKeyClick}
                        edge="end"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        ) : null}
        <Stack direction="row" spacing={2}>
          <LoadingButton
            loading={apiKeyState === APIKeyState.GENERATING}
            variant="contained"
            size="large"
            onClick={handleGenerateAPIKeyClick}
            sx={{ alignSelf: "start" }}
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
              sx={{ alignSelf: "start" }}
            >
              Remove API Key
            </LoadingButton>
          ) : null}
        </Stack>
      </Stack>
    </TabPanel>
  );
};
