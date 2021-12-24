import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import styles from "./Hero.module.css";

const Hero: FC = () => (
  <Box className={`container ${styles.hero}`}>
    <Stack spacing={8} alignItems="center">
      <Stack alignItems="center" spacing={2} justifyContent="center">
        <Typography
          variant="h2"
          component="h1"
          fontWeight={700}
          color="primary.contrastText"
        >
          Fractal Flows
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="primary.contrastText"
          align="center"
        >
          Submit a scientific claim and start collecting knowledge bits
          supporting or refuting it
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button size="large" variant="contained" color="primaryContrast">
          Host new claim
        </Button>
        <Button
          variant="outlined"
          color="primaryContrast"
          startIcon={<i className="fas fa-info"></i>}
        >
          About
        </Button>
        <Button
          variant="outlined"
          color="primaryContrast"
          startIcon={<i className="fas fa-handshake"></i>}
        >
          Code of conduct
        </Button>
      </Stack>
    </Stack>
  </Box>
);

export default Hero;
