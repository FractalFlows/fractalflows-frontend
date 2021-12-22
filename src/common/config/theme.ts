import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
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

export default theme;
