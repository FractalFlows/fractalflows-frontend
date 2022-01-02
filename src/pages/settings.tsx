import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab, Paper, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/system";
import { isEmpty } from "lodash-es";

import { Email } from "modules/settings/components/Email";
import { Web3Connection } from "modules/settings/components/Web3Connection";
import { APIKeys } from "modules/settings/components/APIKeys";
import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";

const settingsTabs = [
  { label: "Profile", value: "profile" },
  { label: "Email", value: "email" },
  { label: "Web3 connection", value: "web3connection" },
  { label: "API Keys", value: "apiKeys" },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { session } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isEmpty(session)) return <AuthWall />;

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Typography variant="h3" component="h1">
          Settings
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          className="horizontal-tabs"
        >
          <TabContext value={activeTab}>
            <Paper variant="outlined" sx={{ alignSelf: "start" }}>
              <TabList
                onChange={(ev, tab) => setActiveTab(tab)}
                orientation={isMobile ? "horizontal" : "vertical"}
                variant="scrollable"
                scrollButtons="auto"
              >
                {settingsTabs.map(({ label, value }) => (
                  <Tab label={label} value={value} key={value} />
                ))}
              </TabList>
            </Paper>

            <TabPanel value="email">
              <Email />
            </TabPanel>
            <TabPanel value="web3connection">
              <Web3Connection />
            </TabPanel>
            <TabPanel value="apiKeys">
              <APIKeys />
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Settings;
