import { AccountCircle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Paper, Stack, Tab, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { useState } from "react";

const tabs = [
  { label: "Claims", value: "email" },
  { label: "Contributed", value: "web3connection" },
  { label: "Following", value: "apiKeys" },
];

const Profile = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("email");

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Avatar src={session.avatar} sx={{ width: "160px", height: "160px" }}>
            <AccountCircle />
          </Avatar>
          <Stack>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              {session.username}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {session.siweMessage?.address}
            </Typography>
          </Stack>
        </Stack>
        <TabContext value={activeTab}>
          <Paper variant="outlined" sx={{ alignSelf: "start" }}>
            <TabList
              onChange={(ev, tab) => setActiveTab(tab)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {tabs.map(({ label, value }) => (
                <Tab label={label} value={value} key={value} />
              ))}
            </TabList>
          </Paper>

          <TabPanel value="email">X{/* <Email /> */}</TabPanel>
          <TabPanel value="web3connection">Y</TabPanel>
          <TabPanel value="apiKeys">Z</TabPanel>
        </TabContext>
      </Stack>
    </Box>
  );
};

export default Profile;
