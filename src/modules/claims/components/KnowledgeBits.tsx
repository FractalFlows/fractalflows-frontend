import { FC, useRef, useState } from "react";
import {
  Typography,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";

import { KnowledgeBitProps } from "modules/claims/interfaces";
import { KnowledgeBit } from "./KnowledgeBit";
import { KnowledgeBitUpsert } from "./KnowledgeBitUpsert";

enum KnowledgeBitsPanelState {
  CREATING,
  UPDATING,
}

export const KnowledgeBitsPanel: FC<{
  title: string;
  knowledgeBits?: KnowledgeBitProps[];
}> = ({ title, knowledgeBits = [] }) => {
  const [knowledgeBitsPanelState, setKnowledgeBitsPanelState] =
    useState<KnowledgeBitsPanelState>();
  const knowledgeBitUpsertRef = useRef(null);

  const handleAddKnowledgeBit = async () => {
    await setKnowledgeBitsPanelState(KnowledgeBitsPanelState.CREATING);
    knowledgeBitUpsertRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Stack sx={{ width: { xs: "100%", md: "47%" } }} spacing={3}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h5" component="h3" flexGrow={1}>
          {title}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddKnowledgeBit}
        >
          Add
        </Button>
      </Stack>
      <Stack spacing={1}>
        {knowledgeBits?.map((knowledgeBit) => (
          <KnowledgeBit knowledgeBit={knowledgeBit} key={knowledgeBit.id} />
        ))}
        {knowledgeBitsPanelState === KnowledgeBitsPanelState.CREATING ? (
          <Box sx={{ p: 4 }} ref={knowledgeBitUpsertRef}>
            <KnowledgeBitUpsert
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
}> = ({ knowledgeBits = [] }) => {
  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4" component="h2">
            What science says: Knowledge Bits
          </Typography>
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
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
        >
          <KnowledgeBitsPanel title="Refuting" knowledgeBits={knowledgeBits} />
          <KnowledgeBitsPanel
            title="Supporting"
            knowledgeBits={knowledgeBits}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
