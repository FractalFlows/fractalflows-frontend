import { DragEvent, FC, SyntheticEvent, useState } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { OpineColumn } from "./OpineColumn";
import styles from "./Opine.module.css";
import { useArguments } from "modules/claims/hooks/useArguments";
import { useOpinion } from "modules/claims/hooks/useOpinion";

export const Opine: FC = ({ acceptance }) => {
  const { setIsOpining } = useOpinion();
  const { addPickedArgument } = useArguments();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (event: DragEvent) => {
    setIsDraggingOver(false);
    const argument = JSON.parse(event.dataTransfer.getData("argument"));
    addPickedArgument(argument);
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

  return (
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
          {/* <Stack direction="row" spacing={6}>
        </Stack> */}
        </Paper>
        <Button variant="contained" size="large">
          Save opinion
        </Button>
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
