import { Box, Button, Stack, Typography } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";

export const AuthWall = () => {
  const { signin } = useAuth();

  return (
    <Box className="container page">
      <Stack spacing={5}>
        <Stack spacing={2}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            fontWeight={700}
          >
            Sign in
          </Typography>
          <Typography variant="body1" align="center">
            In order to continue, please sign in.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<i className="fab fa-ethereum"></i>}
          sx={{ alignSelf: "center" }}
          onClick={signin}
        >
          Sign in with Ethereum
        </Button>
      </Stack>
    </Box>
  );
};
