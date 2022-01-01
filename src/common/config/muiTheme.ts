import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#204E5F",
      contrastText: "#fff",
    },
    secondary: {
      main: "#e4e4e4",
    },
    primaryContrast: {
      main: "#fff",
      contrastText: "#204E5F",
    },
    textSecondary: "#757575",
    error: {
      main: red.A400,
    },
  },
});
