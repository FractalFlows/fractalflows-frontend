import { Container, Stack, Typography } from "@mui/material";

const About = () => {
  return (
    <Container fixed className="page">
      <Stack spacing={7}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            Code of Conduct
          </Typography>
        </Stack>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Community
            </Typography>
            <Typography variant="body1">
              You are here to support or refute scientific/engineering claims as
              a service to society. Remember that our community is made possible
              by volunteers.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Be patient and courteous
            </Typography>
            <Typography variant="body1">
              Be patient and courteous. Offer your contributions to anyone
              struggling or otherwise in need to understand the validity of a
              claim.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Be clear and constructive
            </Typography>
            <Typography variant="body1">
              Be clear and constructive. Knowledge Bits, votes, argumentation
              and opinions are healthy parts of our community.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Be kind
            </Typography>
            <Typography variant="body1">
              Be kind and avoid sarcasm. Tone is hard to decipher online. If a
              situation makes it hard to act kindly, stop contributing and move
              on.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Flag harmful behavior
            </Typography>
            <Typography variant="body1">
              Flag harmful behavior, whether it&apos;s directed at you or
              others.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default About;
