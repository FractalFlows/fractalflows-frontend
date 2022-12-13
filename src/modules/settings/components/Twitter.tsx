import { InputAdornment, Stack, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { TabPanel } from "./TabPanel";
import { useAuth } from "modules/auth/hooks/useAuth";
import { ConnectTwitter } from "common/components/ConnectTwitter";

export const Twitter = () => {
  const { session } = useAuth();
  const { twitter } = session.user;

  return (
    <TabPanel
      title="Twitter"
      description="Connect your Twitter account to request ownership over claims created via the social network"
    >
      {twitter ? (
        <form>
          <TextField
            value={`@${twitter}`}
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
        <ConnectTwitter />
      )}
    </TabPanel>
  );
};
