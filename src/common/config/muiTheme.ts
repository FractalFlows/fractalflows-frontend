import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const fontWeightBold = {
  fontWeight: 400,
};

export const muiTheme = createTheme({
  typography: {
    h1: fontWeightBold,
    h2: fontWeightBold,
    h3: fontWeightBold,
    h4: fontWeightBold,
    h5: fontWeightBold,
    h6: fontWeightBold,
  },
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
    textSecondary: {
      main: "#757575",
    },
    error: {
      main: red.A400,
    },
  },
});
