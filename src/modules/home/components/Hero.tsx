import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import styles from "./Hero.module.css";

const Hero: FC = () => (
  <Box className={`container ${styles.hero}`}>
    <Box sx={{ px: "15px" }}>
      <Stack spacing={8} alignItems="center">
        <Stack spacing={2}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            color="primary.contrastText"
            align="center"
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 2 }}
        >
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
  </Box>
);

export default Hero;
