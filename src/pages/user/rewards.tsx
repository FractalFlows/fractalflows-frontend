import type { NextPage } from "next";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

import { Link } from "common/components/Link";
import { RequireSignIn } from "common/components/RequireSignIn";
import { useClaims } from "modules/claims/hooks/useClaims";
import { useAuth } from "modules/auth/hooks/useAuth";
import { Spinner } from "common/components/Spinner";
import { useSnackbar } from "notistack";

const RewardsWithdraw = ({ claim }) => {
  const { getReleasableRewards, releaseRewards } = useClaims();
  const { session } = useAuth();
  const [rewards, setRewards] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    try {
      const releaseTx = await releaseRewards({
        fractionalizationContract: claim.nftFractionalizationContractAddress,
        token: process.env.NEXT_PUBLIC_FFDST_CONTRACT_ADDRESS,
        owner: session.user.ethAddress,
      });

      await releaseTx.wait();

      enqueueSnackbar("Rewards succesfully withdrawn", {
        variant: "success",
      });

      fetchBalance();
    } catch (e) {
      enqueueSnackbar(e?.message, {
        variant: "error",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const fetchBalance = async () => {
    setIsLoading(true);

    getReleasableRewards({
      fractionalizationContract: claim.nftFractionalizationContractAddress,
      token: process.env.NEXT_PUBLIC_FFDST_CONTRACT_ADDRESS,
      owner: session.user.ethAddress,
    })
      .then((result) => {
        setRewards(result.div("1000000000000000000").toString());
        setIsLoading(false);
      })
      .catch((e) => {
        enqueueSnackbar(e?.message, {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 3, width: "100%" }} key={claim.id}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Link href={`/claim/${claim?.slug}`}>
            <Typography variant="h5" component="h2" flexGrow={1}>
              {claim?.title}
            </Typography>
          </Link>
        </Box>
        <Stack
          sx={{ width: 300, flexShrink: 0 }}
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2">Rewards</Typography>
          {isLoading ? (
            <Spinner size={20} p={0} />
          ) : (
            <Typography variant="h5">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
              }).format(rewards)}{" "}
              FFDST
            </Typography>
          )}
        </Stack>
        <Box
          sx={{
            width: 150,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <LoadingButton
            variant="contained"
            size="large"
            loading={isLoading || isWithdrawing}
            disabled={isLoading === false && rewards === "0"}
            onClick={handleWithdraw}
          >
            Withdraw
          </LoadingButton>
        </Box>
      </Stack>
    </Paper>
  );
};

const Rewards: NextPage = RequireSignIn(() => {
  const { getUserClaims, getUserContributedClaims } = useClaims();
  const { session } = useAuth();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (session.user) {
      const { username } = session.user;

      Promise.all([
        getUserClaims({ username }),
        getUserContributedClaims({ username }),
      ]).then((result) => {
        setClaims([...result[0], ...result[1]]);
      });
    }
  }, [session]);

  return (
    <Container className="page">
      <Stack spacing={5}>
        <Typography variant="h3" component="h1">
          Rewards
        </Typography>

        <Stack spacing={3}>
          {claims.map((claim) => (
            <RewardsWithdraw claim={claim} key={claim.id} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
});

export default Rewards;
