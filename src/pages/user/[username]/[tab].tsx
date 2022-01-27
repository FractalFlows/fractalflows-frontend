import { FC, SyntheticEvent } from "react";
import { AccountCircle } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, Paper, Stack, Tab, Typography } from "@mui/material";

import { ClaimsList } from "modules/claims/components/ClaimsList";
import type { ClaimProps } from "modules/claims/interfaces";
import { ProfileProps } from "modules/users/interfaces";
import { UsersService } from "modules/users/services/users";
import { Spinner } from "common/components/Spinner";
import { useRouter } from "next/router";
import Head from "next/head";
import { ClaimsService } from "modules/claims/services/claims";
import { get, map, reduce } from "lodash-es";
import { Container } from "@mui/material";
import { Link } from "common/components/Link";

enum ProfileTab {
  CLAIMS = "claims",
  CONTRIBUTED = "contributed",
  FOLLOWING = "following",
}

const profileTabs: {
  label: string;
  value: string;
}[] = [
  { label: "Claims", value: ProfileTab.CLAIMS },
  { label: "Contributed", value: ProfileTab.CONTRIBUTED },
  { label: "Following", value: ProfileTab.FOLLOWING },
];

interface ProfileComponentProps {
  profile: ProfileProps;
  userClaims: ClaimProps[];
}

const Profile: FC<ProfileComponentProps> = ({ profile, userClaims }) => {
  const router = useRouter();
  const handleTabChange = async (ev: SyntheticEvent, tab: ProfileTab) => {
    router.push(`/user/${router.query.username as string}/${tab}`);
  };

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
          <TabContext
            value={
              router.isReady
                ? (router.query.tab as string).toLowerCase()
                : ProfileTab.CLAIMS
            }
          >
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
            <TabPanel value={ProfileTab.CLAIMS}>
              <ClaimsList claims={userClaims} />
            </TabPanel>
            <TabPanel value={ProfileTab.CONTRIBUTED}>
              <ClaimsList claims={userClaims} />
            </TabPanel>
            <TabPanel value={ProfileTab.FOLLOWING}>
              <ClaimsList claims={userClaims} />
            </TabPanel>
          </TabContext>
        </Stack>
      </Stack>
    </Container>
  );
};

export async function getStaticProps({ params }) {
  try {
    const { username, tab } = params;

    const getUserClaims = async () => {
      switch (tab.toLowerCase()) {
        case ProfileTab.CLAIMS:
          return await ClaimsService.getUserClaims({ username });
        case ProfileTab.CONTRIBUTED:
          return await ClaimsService.getUserContributedClaims({
            username,
          });
        case ProfileTab.FOLLOWING:
          return await ClaimsService.getUserFollowingClaims({
            username,
          });
      }
    };

    const profile = await UsersService.getProfile({
      username,
    });

    return {
      props: {
        profile,
        userClaims: await getUserClaims(),
      },
      revalidate: Number(process.env.ISR_REVALIDATE_PERIOD),
    };
  } catch (e) {
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const trendingClaims = await ClaimsService.getTrendingClaims({
    offset: 0,
    limit: 10,
  });

  return {
    paths: reduce(
      get(trendingClaims, "data"),
      (acc: any, { user }: ClaimProps) => [
        ...acc,
        ...map(profileTabs, ({ value: tab }) => ({
          params: { username: user.username, tab },
        })),
      ],
      []
    ),
    fallback: true,
  };
}

export default Profile;
