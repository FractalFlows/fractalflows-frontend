import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ArgumentSides, OpinionProps } from "modules/claims/interfaces";
import { ArgumentColumn } from "./ArgumentColumn";
import { getOpinion, useOpinions } from "modules/claims/hooks/useOpinions";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";
import { getGatewayFromIPFSURI } from "common/utils/ipfs";
import { Link } from "common/components/Link";

export const Opinion = () => {
  const [opinion, setOpinion] = useState({} as OpinionProps);
  const [isLoadingOpinion, setIsLoadingOpinion] = useState(true);
  const { showOpinionId, setShowOpinionId } = useOpinions();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsLoadingOpinion(true);
    getOpinion({ id: showOpinionId })
      .then((data) => setOpinion(data))
      .catch((e: any) => enqueueSnackbar(e?.message, { variant: "error" }))
      .finally(() => setIsLoadingOpinion(false));
  }, [showOpinionId]);

  const cons = opinion?.arguments?.filter(
    (argument) => argument.side === ArgumentSides.CON
  );
  const pros = opinion?.arguments?.filter(
    (argument) => argument.side === ArgumentSides.PRO
  );

  if (isLoadingOpinion) return <Spinner p={0} />;

  return (
    <Stack spacing={5}>
      <Stack spacing={3}>
        <Typography variant="h4" align="center" title={opinion?.user?.username}>
          <span style={{ maxWidth: 250, display: "inline-flex" }}>
            <b className="text-overflow-ellipsis">{opinion?.user?.username}</b>
          </span>
          &apos;s opinion
        </Typography>
        <Stack spacing={3} direction="row" justifyContent="center">
          <Typography variant="body2">
            Token ID:&nbsp;
            <Link
              href={`${process.env.NEXT_PUBLIC_ETH_EXPLORER_URL}/token/${process.env.NEXT_PUBLIC_OPINION_CONTRACT_ADDRESS}?a=${opinion?.nftTokenId}`}
              text
              blank
            >
              {opinion?.nftTokenId}
            </Link>
          </Typography>
          <Typography variant="body2">
            Metadata:&nbsp;
            <Link
              href={getGatewayFromIPFSURI(opinion?.nftMetadataURI)}
              text
              blank
            >
              IPFS
            </Link>
          </Typography>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
        <ArgumentColumn title="Cons" arguments={cons} />
        <ArgumentColumn title="Pros" arguments={pros} />
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowOpinionId(null)}
      >
        Back to results
      </Button>
    </Stack>
  );
};
