import { FC, SyntheticEvent, useEffect, useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Paper, Stack, Tab, Typography } from "@mui/material";

import { useUsers } from "modules/users/hooks/useUsers";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import type { ClaimProps } from "modules/claims/interfaces";
import { ProfileProps, UserClaimRelation } from "modules/users/interfaces";
import { UsersService } from "modules/users/services/users";
import { Spinner } from "common/components/Spinner";
import { useRouter } from "next/router";
import Head from "next/head";
import { ClaimsService } from "modules/claims/services/claims";
import { get, map } from "lodash-es";
import { Container } from "@mui/material";
import { useSnackbar } from "notistack";
import { useClaims } from "modules/claims/hooks/useClaims";

const profileTabs: {
  label: string;
  value: UserClaimRelation;
}[] = [
  { label: "Claims", value: UserClaimRelation.OWN },
  { label: "Contributed", value: UserClaimRelation.CONTRIBUTED },
  { label: "Following", value: UserClaimRelation.FOLLOWING },
];

const Profile: FC<any> = (serverProps) => {
  const router = useRouter();
  const { getProfile } = useUsers();
  const { getUserClaims, getUserContributedClaims, getUserFollowingClaims } =
    useClaims();
  const [activeTab, setActiveTab] = useState<UserClaimRelation>(
    UserClaimRelation.OWN
  );
  const [loadingClaims, setLoadingClaims] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileProps>(serverProps.profile);
  const [claims, setClaims] = useState<ClaimProps[]>(serverProps.userClaims);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = async (
    ev: SyntheticEvent,
    tab: UserClaimRelation
  ) => {
    setActiveTab(tab);
    setLoadingClaims(true);

    const username = router.query.username as string;

    try {
      switch (tab) {
        case UserClaimRelation.OWN:
          const userClaims = await getUserClaims({ username });
          setClaims(userClaims);
          break;
        case UserClaimRelation.CONTRIBUTED:
          const userContributedClaims = await getUserContributedClaims({
            username,
          });
          setClaims(userContributedClaims);
          break;
        case UserClaimRelation.FOLLOWING:
          const userFollowingClaims = await getUserFollowingClaims({
            username,
          });
          setClaims(userFollowingClaims);
          break;
      }
    } catch (e: any) {
      enqueueSnackbar(e?.message || e, { variant: "error" });
    } finally {
      setLoadingClaims(false);
    }
  };

  useEffect(() => {
    setProfile(serverProps.profile);
    setClaims(serverProps.userClaims);
  }, [serverProps]);

  if (router.isFallback) {
    return (
      <Container className="page">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="page">
      <Head>
        <title>{profile?.username}</title>
        <meta property="og:title" content={profile?.username} />
      </Head>

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
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const { username } = params;
  const profile = await UsersService.getProfile({
    username,
  });

  return {
    props: profile,
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const trendingClaims = await ClaimsService.getTrendingClaims({
    offset: 0,
    limit: 10,
  });

  return {
    paths: map(get(trendingClaims, "data"), ({ user }: ClaimProps) => ({
      params: { username: user.username },
    })),
    fallback: true,
  };
}

export default Profile;
