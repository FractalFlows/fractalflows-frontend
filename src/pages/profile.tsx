import { useEffect, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Paper, Stack, Tab, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { useClaims } from "modules/claims/hooks/useClaims";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import { Claim, UserClaimRelation } from "modules/claims/interfaces";

const profileTabs: {
  label: string;
  value: UserClaimRelation;
}[] = [
  { label: "Claims", value: UserClaimRelation.OWN },
  { label: "Contributed", value: UserClaimRelation.CONTRIBUTED },
  { label: "Following", value: UserClaimRelation.FOLLOWING },
];

const Profile = () => {
  const { session } = useAuth();
  const { getUserClaims } = useClaims();
  const [activeTab, setActiveTab] = useState<UserClaimRelation>(
    UserClaimRelation.OWN
  );
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    getUserClaims({ relation: activeTab }).then((data) => {
      setClaims(data);
    });
  }, [activeTab, getUserClaims]);

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
        >
          <Avatar src={session.avatar} sx={{ width: "160px", height: "160px" }}>
            <AccountCircle sx={{ fontSize: 160 }} />
          </Avatar>
          <Stack alignItems={{ xs: "center", md: "initial" }} spacing={0.5}>
            <Typography
              variant="h3"
              component="h1"
              noWrap
              sx={{
                maxWidth: { xs: 300, sm: "initial" },
                textAlign: { xs: "center", md: "start" },
              }}
            >
              {session.username}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              noWrap
              sx={{
                maxWidth: { xs: 200, sm: "initial" },
                textAlign: { xs: "center", md: "start" },
              }}
            >
              {session.user?.ethAddress}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={3}>
          <TabContext value={activeTab}>
            <Paper variant="outlined" sx={{ alignSelf: "start" }}>
              <TabList
                onChange={(ev, tab) => setActiveTab(tab)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {profileTabs.map(({ label, value }) => (
                  <Tab label={label} value={value} key={value} />
                ))}
              </TabList>
            </Paper>

            <TabPanel value={UserClaimRelation.OWN}>
              <ClaimsList claims={claims} />
            </TabPanel>
            <TabPanel value={UserClaimRelation.CONTRIBUTED}>
              <ClaimsList claims={claims} />
            </TabPanel>
            <TabPanel value={UserClaimRelation.FOLLOWING}>
              <ClaimsList claims={claims} />
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Profile;
