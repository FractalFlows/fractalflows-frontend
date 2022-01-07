import { FC, useState } from "react";
import { Button, Paper, Stack } from "@mui/material";

import { ArgumentSides } from "modules/claims/interfaces";
import { OpineColumn } from "./OpineColumn";
import styles from "./Opine.module.css";

export const Opine: FC = ({
  setIsOpining,
  pickedArguments,
  setPickedArguments,
  acceptance,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const handleDrop = (event) => {
    setIsDraggingOver(false);
    const argument = JSON.parse(event.dataTransfer.getData("argument"));
    setPickedArguments([...pickedArguments, argument]);
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
    <Stack spacing={2}>
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
        <Stack direction="row" spacing={6}>
          <OpineColumn side={ArgumentSides.CON} />
          <OpineColumn side={ArgumentSides.PRO} />
        </Stack>
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
  );
};
