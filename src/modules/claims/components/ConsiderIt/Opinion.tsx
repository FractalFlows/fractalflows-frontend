import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { ArgumentSides, OpinionProps } from "modules/claims/interfaces";
import { ArgumentColumn } from "./ArgumentColumn";
import { getOpinion, useOpinions } from "modules/claims/hooks/useOpinions";
import { useSnackbar } from "notistack";
import { Spinner } from "common/components/Spinner";

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
      <Typography variant="h4" align="center" title={opinion?.user?.username}>
        <span style={{ maxWidth: 250, display: "inline-flex" }}>
          <b className="text-overflow-ellipsis">{opinion?.user?.username}</b>
        </span>
        &apos;s opinion
      </Typography>

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
