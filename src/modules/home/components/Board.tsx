import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

import styles from "./Board.module.css";
import BoardItem from "./BoardItem";

const Board: FC = () => (
  <Box className={`container ${styles.board}`}>
    <Stack spacing={4}>
      <ButtonGroup>
        <Button variant="contained">Trending claims</Button>
        <Button>All</Button>
      </ButtonGroup>
      <Stack spacing={1}>
        {[0, 1, 2].map((i) => (
          <BoardItem key={i}>&nbsp;</BoardItem>
        ))}
      </Stack>
    </Stack>
  </Box>
);

export default Board;
