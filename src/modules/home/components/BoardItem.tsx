import { FC } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import styles from "./BoardItem.module.css";

const BoardItem: FC = ({ children }) => <Paper elevation={2}>{children}</Paper>;

export default BoardItem;
