import { DragEvent, FC, SyntheticEvent, useState } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { OpineColumn } from "./OpineColumn";
import styles from "./Opine.module.css";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export const Opine: FC = () => {
  const { setIsOpining, userOpinion, addArgumentToOpinion, saveOpinion } =
    useOpinions();
  const [isSavingOpinion, setIsSavingOpinion] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleDrop = (event: DragEvent) => {
    setIsDraggingOver(false);
    const argument = JSON.parse(event.dataTransfer.getData("argument"));
    addArgumentToOpinion(argument);
  };
  const handleDragOver = (event: SyntheticEvent) => {
    event.preventDefault();
  };
  const handleDragEnter = () => {
    setIsDraggingOver(true);
  };
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  const handleSaveOpinion = async () => {
    setIsSavingOpinion(true);

    try {
      await saveOpinion({ opinion: userOpinion });
      enqueueSnackbar("Your opinion has been succesfully saved!", {
        variant: "success",
      });
      setIsOpining(false);
    } catch (e) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    } finally {
      setIsSavingOpinion(false);
    }
  };

  return (
    // This extra div is necessary to make the sticky position work
    <div>
      <Stack spacing={2} sx={{ position: "sticky", top: "20px" }}>
        <Paper
          variant="outlined"
          sx={{
            width: 700,
            p: 3,
            paddingBottom: 8,
            borderStyle: isDraggingOver ? "solid" : "dashed",
            backgroundColor: isDraggingOver ? "#f5f5f5" : "",
            borderRadius: "10px",
            borderWidth: 3,
          }}
          className={isDraggingOver ? styles.opine__droparea : ""}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div
            style={{
              display: "grid",
              columnGap: "40px",
              rowGap: "20px",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <Typography variant="h5">Give your arguments against</Typography>
            <Typography variant="h5">Give your arguments for</Typography>
            <OpineColumn side={ArgumentSides.CON} />
            <OpineColumn side={ArgumentSides.PRO} />
          </div>
        </Paper>
        <LoadingButton
          loading={isSavingOpinion}
          variant="contained"
          size="large"
          onClick={handleSaveOpinion}
        >
          Save opinion
        </LoadingButton>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => setIsOpining(false)}
        >
          Skip to results
        </Button>
      </Stack>
    </div>
  );
};
