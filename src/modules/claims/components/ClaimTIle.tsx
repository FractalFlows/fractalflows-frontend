import { FC, SyntheticEvent, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { isEmpty, get, filter } from "lodash-es";
import { useSnackbar } from "notistack";

import { Link } from "common/components/Link";
import type { ClaimProps } from "../interfaces";
import { AuthorBlock } from "modules/users/components/AuthorBlock";
import { TagProps } from "modules/tags/interfaces";
import { KnowledgeBitSides } from "modules/claims/interfaces";
import { Histogram, HistogramPlacement } from "./ConsiderIt/Histogram";
import { Spinner } from "common/components/Spinner";
import { useAuth } from "modules/auth/hooks/useAuth";
import { UserRole } from "modules/users/interfaces";
import { useClaims } from "../hooks/useClaims";

export const ClaimTile: FC<{ claim: ClaimProps }> = ({ claim }) => {
  const { session } = useAuth();
  const { reenableClaim } = useClaims();
  const [isReenableDialogOpen, setIsReenableDialogOpen] = useState(false);
  const [isReenabling, setIsReenabling] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const refutingKnowledgeBitsCount = filter(get(claim, "knowledgeBits"), {
    side: KnowledgeBitSides.REFUTING,
  }).length;
  const supportingKnowledgeBitsCount = filter(get(claim, "knowledgeBits"), {
    side: KnowledgeBitSides.SUPPORTING,
  }).length;

  const handleReenableClick = (ev: SyntheticEvent) => {
    ev.preventDefault();
    setIsReenableDialogOpen(true);
  };
  const handleReenable = async () => {
    setIsReenabling(true);

    try {
      await reenableClaim({ id: claim?.id as string });
      setIsReenableDialogOpen(false);
      enqueueSnackbar("The claim has been sucesfully re-enabled!", {
        variant: "success",
      });
    } catch (e: any) {
      enqueueSnackbar(e?.message || e, {
        variant: "error",
      });
    } finally {
      setIsReenabling(false);
    }
  };
  const handleReenableDialogClose = () => setIsReenableDialogOpen(false);

  return (
    <>
      <Link href={`/claim/${claim?.slug}`}>
        <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
          <Stack spacing={1}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Typography variant="h5" component="h2" flexGrow={1}>
                {claim?.title}
              </Typography>
              {get(session, "user.role") === UserRole.ADMIN &&
              get(claim, "disabled") ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReenableClick}
                  flexShrink={0}
                >
                  Re-enable
                </Button>
              ) : null}
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{ alignItems: { xs: "", md: "center" } }}
              spacing={4}
            >
              <Stack spacing={2} flexGrow={1}>
                {claim?.user ? (
                  <AuthorBlock
                    user={claim?.user}
                    origin={claim?.origin}
                    createdAt={claim?.createdAt}
                    size={25}
                  />
                ) : null}
                {claim?.summary ? (
                  <Typography variant="body1" title={claim.summary}>
                    {claim.summary.substring(0, 350)}
                    {claim.summary.length > 350 ? "..." : ""}
                  </Typography>
                ) : null}
                {isEmpty(claim?.tags) ? null : (
                  <Stack direction="row" spacing={1}>
                    {claim?.tags?.map(({ id, label }: TagProps) => (
                      <Chip key={id} label={label} />
                    ))}
                  </Stack>
                )}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 1, md: 4 }}
                >
                  <Stack direction="row" spacing={1}>
                    <ArrowDownwardIcon color="error" sx={{ fontSize: 20 }} />
                    <Typography variant="body1">
                      {refutingKnowledgeBitsCount} knowledge bit
                      {refutingKnowledgeBitsCount === 1 ? "" : "s"} refuting it
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ArrowUpwardIcon color="success" sx={{ fontSize: 20 }} />
                    <Typography variant="body1">
                      {supportingKnowledgeBitsCount} knowledge bit
                      {supportingKnowledgeBitsCount === 1 ? "" : "s"} supporting
                      it
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack sx={{ width: 300, flexShrink: 0 }}>
                <Histogram
                  opinions={claim.opinions}
                  height={100}
                  placement={HistogramPlacement.CLAIM_TILE}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Link>
      <Dialog
        open={isReenableDialogOpen}
        onClose={handleReenableDialogClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="reenable-claim-dialog-title"
      >
        <DialogTitle id="reenable-claim-dialog-title">
          Re-enable this claim?
        </DialogTitle>
        {isReenabling ? (
          <Spinner />
        ) : (
          <DialogActions>
            <Button onClick={handleReenableDialogClose}>Cancel</Button>
            <Button onClick={handleReenable} autoFocus>
              Re-enable
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
