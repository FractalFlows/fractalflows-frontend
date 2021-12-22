import "@mui/material/styles";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface Palette {
    primaryContrast: Palette["primary"];
  }
  interface PaletteOptions {
    primaryContrast: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    primaryContrast: true;
  }
}
