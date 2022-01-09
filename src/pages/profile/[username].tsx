import { SyntheticEvent, useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { AccountCircle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Paper, Stack, Tab, Typography } from "@mui/material";

import { useUsers } from "modules/users/hooks/useUsers";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import type { ClaimProps } from "modules/claims/interfaces";
import { ProfileProps, UserClaimRelation } from "modules/users/interfaces";
import { UsersService } from "modules/users/services/users";

const profileTabs: {
  label: string;
  value: UserClaimRelation;
}[] = [
  { label: "Claims", value: UserClaimRelation.OWN },
  { label: "Contributed", value: UserClaimRelation.CONTRIBUTED },
  { label: "Following", value: UserClaimRelation.FOLLOWING },
];

const Profile = (
  serverProps: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { getProfile } = useUsers();
  const [activeTab, setActiveTab] = useState<UserClaimRelation>(
    UserClaimRelation.OWN
  );
  const [loadingClaims, setLoadingClaims] = useState<boolean>(false);
  const [profile] = useState<ProfileProps>(serverProps.profile);
  const [claims, setClaims] = useState<ClaimProps[]>(serverProps.userClaims);

  const handleTabChange = (ev: SyntheticEvent, tab: UserClaimRelation) => {
    setActiveTab(tab);
    setLoadingClaims(true);

    getProfile({
      username: serverProps.username,
      claimsRelation: tab,
    })
      .then((data) => {
        setClaims(data.userClaims);
      })
      .finally(() => {
        setLoadingClaims(false);
      });
  };

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
        >
          <Avatar
            src={`${profile?.avatar}?s=160`}
            sx={{ width: "160px", height: "160px" }}
          >
            <AccountCircle sx={{ fontSize: 160 }} />
          </Avatar>
          <Stack alignItems={{ xs: "center", md: "initial" }} spacing={0.5}>
            <Typography
              variant="h3"
              component="h1"
              noWrap
              sx={{
                maxWidth: { xs: 300, sm: 600 },
                textAlign: { xs: "center", md: "start" },
              }}
              title={profile?.username}
            >
              {profile?.username}
            </Typography>
            {profile?.ethAddress &&
            profile?.ethAddress !== profile?.username ? (
              <Typography
                variant="body1"
                color="textSecondary"
                noWrap
                sx={{
                  maxWidth: { xs: 200, sm: "initial" },
                  textAlign: { xs: "center", md: "start" },
                }}
                title={profile?.ethAddress}
              >
                {profile?.ethAddress}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
        <Stack spacing={3}>
          <TabContext value={activeTab}>
            <Paper variant="outlined" sx={{ alignSelf: "start" }}>
              <TabList
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {profileTabs.map(({ label, value }) => (
                  <Tab label={label} value={value} key={value} />
                ))}
              </TabList>
            </Paper>
            <TabPanel value={UserClaimRelation.OWN}>
              <ClaimsList claims={claims} loading={loadingClaims} />
            </TabPanel>
            <TabPanel value={UserClaimRelation.CONTRIBUTED}>
              <ClaimsList claims={claims} loading={loadingClaims} />
            </TabPanel>
            <TabPanel value={UserClaimRelation.FOLLOWING}>
              <ClaimsList claims={claims} loading={loadingClaims} />
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const { username } = context.query;
  const profile = await UsersService.getProfile({
    username,
    claimsRelation: UserClaimRelation.OWN,
  });
  return {
    props: {
      ...profile,
      username,
    },
  };
}

export default Profile;
