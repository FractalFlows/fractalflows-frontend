import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#204E5F",
      contrastText: "#fff",
    },
    secondary: {
      main: "#19857b",
    },
    primaryContrast: {
      main: "#fff",
      contrastText: "#204E5F",
    },
    error: {
      main: red.A400,
    },
  },
});
