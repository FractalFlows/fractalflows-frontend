import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Stack, Tab, Paper, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/system";

import { Email } from "modules/settings/components/Email";
import { Twitter } from "modules/settings/components/Twitter";
import { APIKeys } from "modules/settings/components/APIKeys";
import { Profile } from "modules/settings/components/Profile";
import { useRouter } from "next/router";
import { Container } from "@mui/material";
import { RequireSignIn } from "common/components/RequireSignIn";

const settingsTabs = [
  { label: "Profile", value: "profile" },
  { label: "Email", value: "email" },
  { label: "Twitter", value: "twitter" },
  { label: "API Keys", value: "apiKeys" },
];

const Settings = RequireSignIn(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (ev: any, tab: string) => {
    setActiveTab(tab);
    router.push(`/settings/${tab}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (router.isReady) {
      setActiveTab((router.query.tab as string).toLowerCase());
    }
  }, [router.isReady]);

  return (
    <Container className="page">
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
            <Paper
              variant="outlined"
              sx={{ alignSelf: "start", flexShrink: 0 }}
            >
              <TabList
                onChange={handleTabChange}
                orientation={isMobile ? "horizontal" : "vertical"}
                variant="scrollable"
                scrollButtons="auto"
              >
                {settingsTabs.map(({ label, value }) => (
                  <Tab label={label} value={value} key={value} />
                ))}
              </TabList>
            </Paper>

            <TabPanel value="profile">
              <Profile />
            </TabPanel>
            <TabPanel value="email">
              <Email />
            </TabPanel>
            <TabPanel value="twitter">
              <Twitter />
            </TabPanel>
            <TabPanel value="apiKeys">
              <APIKeys />
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </Container>
  );
});

export default Settings;
