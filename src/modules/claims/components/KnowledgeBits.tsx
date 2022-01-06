import { FC, useMemo, useRef, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";

import {
  KnowledgeBitProps,
  KnowledgeBitSides,
  KnowledgeBitVoteProps,
} from "modules/claims/interfaces";
import { KnowledgeBit } from "./KnowledgeBit";
import { KnowledgeBitUpsert } from "./KnowledgeBitUpsert";
import { NoResults } from "common/components/NoResults";
import { useClaims } from "../hooks/useClaims";
import { useRouter } from "next/router";

enum KnowledgeBitsPanelState {
  CREATING,
  UPDATING,
}

const KnowledgeBitsPanelTexts = {
  [KnowledgeBitSides.REFUTING]: {
    panelTitle: "Refuting",
    side: "refuting",
  },
  [KnowledgeBitSides.SUPPORTING]: {
    panelTitle: "Supporting",
    side: "supporting",
  },
};

export const KnowledgeBitsPanel: FC<{
  side: KnowledgeBitSides;
  knowledgeBits?: KnowledgeBitProps[];
  userVotes: KnowledgeBitVoteProps[];
}> = ({ side, knowledgeBits = [], userVotes: preloadedUserVotes }) => {
  const { getUserKnowledgeBitsVotes } = useClaims();
  const [knowledgeBitsPanelState, setKnowledgeBitsPanelState] =
    useState<KnowledgeBitsPanelState>();
  const [userVotes, setUserVotes] =
    useState<KnowledgeBitVoteProps[]>(preloadedUserVotes);
  const knowledgeBitUpsertRef = useRef(null);
  const router = useRouter();

  const handleAddKnowledgeBit = async () => {
    await setKnowledgeBitsPanelState(KnowledgeBitsPanelState.CREATING);
    knowledgeBitUpsertRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const handleUserVotesReload = async () => {
    const updatedUserVotes = await getUserKnowledgeBitsVotes({
      claimSlug: router.query.slug as string,
    });
    setUserVotes(updatedUserVotes);
  };

  return (
    <Stack sx={{ width: { xs: "100%", md: "47%" } }} spacing={3}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h5" component="h3" flexGrow={1}>
          {KnowledgeBitsPanelTexts[side].panelTitle}
        </Typography>
        <Button variant="contained" onClick={handleAddKnowledgeBit}>
          Add
        </Button>
      </Stack>
      <Stack spacing={1}>
        {knowledgeBits?.map((knowledgeBit) => (
          <KnowledgeBit
            knowledgeBit={knowledgeBit}
            userVote={userVotes?.find(
              (userVote) => userVote.knowledgeBit.id === knowledgeBit.id
            )}
            handleUserVotesReload={handleUserVotesReload}
            key={knowledgeBit.id}
          />
        ))}
        {knowledgeBits.length === 0 &&
        knowledgeBitsPanelState !== KnowledgeBitsPanelState.CREATING ? (
          <NoResults>
            We couldn&apos;t find any {KnowledgeBitsPanelTexts[side].side}{" "}
            knowledge bits at this time
          </NoResults>
        ) : null}
        {knowledgeBitsPanelState === KnowledgeBitsPanelState.CREATING ? (
          <Box
            sx={{ py: { xs: 2, sm: 4 }, px: { xs: 0, sm: 4 } }}
            ref={knowledgeBitUpsertRef}
          >
            <KnowledgeBitUpsert
              knowledgeBit={{ side } as KnowledgeBitProps}
              handleClose={() => setKnowledgeBitsPanelState(undefined)}
            />
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export const KnowledgeBits: FC<{
  knowledgeBits?: KnowledgeBitProps[];
  userVotes?: KnowledgeBitVoteProps[];
}> = ({ knowledgeBits = [], userVotes = [] }) => {
  const refutingKnowledgeBits = useMemo(
    () =>
      knowledgeBits.filter(({ side }) => side === KnowledgeBitSides.REFUTING),
    [knowledgeBits]
  );
  const supportingKnowledgeBits = useMemo(
    () =>
      knowledgeBits.filter(({ side }) => side === KnowledgeBitSides.SUPPORTING),
    [knowledgeBits]
  );

  return (
    <Box>
      <Stack spacing={4}>
        <Typography variant="h4" component="h2">
          What science says: Knowledge Bits
          <Tooltip
            title={
              <>
                <Typography variant="body1" fontWeight="700">
                  What are Knowledge Bits?
                </Typography>
                <br />
                <Typography variant="body2">
                  <b>Knowledge bits</b> are numerical bits, files, containing
                  simulation results, experimental results, detailed analysis,
                  datasets, detailed mathematical formulations, scripts, source
                  code, reviews, reproduction of results, etc. They could also
                  be files containing statement of assumptions, hypothesis and
                  methodologies. Knowledge bits are the hidden backbone,
                  essentially the atomic particles composing a scientific work,
                  while the associated scientific publication is merely its
                  projection on a piece of (digital) paper.
                </Typography>
              </>
            }
          >
            <IconButton sx={{ marginLeft: 1 }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 8, sm: 3 }}
          justifyContent="space-between"
        >
          <KnowledgeBitsPanel
            side={KnowledgeBitSides.REFUTING}
            knowledgeBits={refutingKnowledgeBits}
            userVotes={userVotes}
          />
          <KnowledgeBitsPanel
            side={KnowledgeBitSides.SUPPORTING}
            knowledgeBits={supportingKnowledgeBits}
            userVotes={userVotes}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
