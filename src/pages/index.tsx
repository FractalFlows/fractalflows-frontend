import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import type { NextPage } from "next";
import { Box, Button, Paper, Stack, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useSnackbar } from "notistack";
import * as Sentry from "@sentry/nextjs";

import { ClaimsService } from "modules/claims/services/claims";
import type { ClaimProps } from "modules/claims/interfaces";
import { ClaimsList } from "modules/claims/components/ClaimsList";
import styles from "modules/home/components/Hero.module.css";
import { Link } from "common/components/Link";
import { useClaims } from "modules/claims/hooks/useClaims";
import { Container } from "@mui/material";

enum HomeTab {
  TRENDING = "TRENDING",
  ALL = "ALL",
}

const homeTabs = [
  { label: "Trending claims", value: HomeTab.TRENDING },
  { label: "All", value: HomeTab.ALL },
];

interface HomeProps {
  trendingClaims: ClaimProps[];
}

const limit = 10;

const Home: NextPage<HomeProps> = (serverProps) => {
  const { getTrendingClaims, getClaims } = useClaims();
  const [activeTab, setActiveTab] = useState<HomeTab>(HomeTab.TRENDING);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [claims, setClaims] = useState<ClaimProps[]>(
    serverProps.trendingClaims.data
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = async (ev: SyntheticEvent, tab: HomeTab) => {
    setActiveTab(tab);
    setIsLoading(true);
    setClaims([]);
    setTotalCount(0);
    setOffset(0);

    const pagination = { limit, offset: 0 };

    try {
      const trendingClaims = await (tab === HomeTab.TRENDING
        ? getTrendingClaims
        : getClaims)(pagination);
      setClaims(trendingClaims.data);
      setTotalCount(trendingClaims.totalCount);
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleFetchMore = async () => {
    if (totalCount <= offset + limit || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const updatedOffset = offset + limit;
      setOffset(offset + limit);
      const allClaims = await getClaims({ limit, offset: updatedOffset });
      setClaims([...claims, ...allClaims.data]);
      setTotalCount(allClaims.totalCount);
    } catch (e: any) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <div className={`${styles.hero}`}>
        <Image
          src="/images/hero.png"
          alt="Hero background"
          className={styles.hero__background}
          layout="fill"
          objectFit="cover"
          objectPosition="bottom"
          priority
          quality={100}
        />
        <Container fixed>
          <Box sx={{ px: "15px" }} className={styles.hero__content}>
            <Stack spacing={8} alignItems="center">
              <Stack spacing={2}>
                <Typography
                  variant="h2"
                  component="h1"
                  color="primary.contrastText"
                  align="center"
                  fontWeight="700"
                >
                  Fractal Flows
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  color="primary.contrastText"
                  align="center"
                  fontWeight="400"
                >
                  Submit a scientific claim and start collecting knowledge bits
                  supporting or refuting it
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 2 }}
              >
                <Link href="/claim/new">
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    color="primaryContrast"
                  >
                    Host new claim
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="large"
                    variant="outlined"
                    color="primaryContrast"
                    startIcon={<i className="fas fa-info"></i>}
                  >
                    About
                  </Button>
                </Link>
                <Link href="/code-of-conduct">
                  <Button
                    size="large"
                    variant="outlined"
                    color="primaryContrast"
                    startIcon={<i className="fas fa-handshake"></i>}
                  >
                    Code of conduct
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </div>
      <Container sx={{ py: 12 }}>
        <Stack spacing={{ xs: 3, md: 4 }} className="horizontal-tabs">
          <TabContext value={activeTab}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Paper variant="outlined" sx={{ alignSelf: "start" }}>
                <TabList
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {homeTabs.map(({ label, value }) => (
                    <Tab label={label} value={value} key={value} />
                  ))}
                </TabList>
              </Paper>
              {activeTab === HomeTab.ALL && claims.length > 0 ? (
                <Typography variant="body1">
                  Showing {claims.length} of {totalCount}
                </Typography>
              ) : null}
            </Stack>

            <TabPanel value={HomeTab.TRENDING}>
              <ClaimsList claims={claims} loading={isLoading} />
            </TabPanel>
            <TabPanel value={HomeTab.ALL}>
              <ClaimsList
                claims={claims}
                loading={isLoading}
                loadingMore={isLoadingMore}
                handleFetchMore={handleFetchMore}
              />
            </TabPanel>
          </TabContext>
        </Stack>
      </Container>
    </>
  );
};

export async function getStaticProps() {
  try {
    const trendingClaims = await ClaimsService.getTrendingClaims({
      offset: 0,
      limit,
    });

    return {
      props: {
        trendingClaims,
      },
      revalidate: Number(process.env.ISR_REVALIDATE_PERIOD),
    };
  } catch (e) {
    Sentry.captureException(e);
    return { notFound: true };
  }
}

export default Home;
