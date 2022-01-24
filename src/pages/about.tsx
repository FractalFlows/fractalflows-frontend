import { Container, Stack, Typography } from "@mui/material";

const About = () => {
  return (
    <Container fixed className="page">
      <Stack spacing={7}>
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            About
          </Typography>
          <Typography variant="h4" component="h2" color="textSecondary">
            Fractal Flows is a decentralized collective intelligence that
            emerges a consensus about science and engineering claims!
          </Typography>
        </Stack>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Hosting claims
            </Typography>
            <Typography variant="body1">
              Individuals, researchers, startups, corporations and governments
              make claims pertaining to science and engineering matters. Let us
              challenge those claims and expose the evidence behind them; Host a
              science/engineering claim, share the claim page via a multitude of
              social platforms, and start collecting knowledge bits supporting
              or refuting the claim. In so doing we emerge the hidden evidence
              behind the claims as a service to society, stakeholders,
              investors, etc...
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Knowledge bits
            </Typography>
            <Typography variant="body1">
              Science and engineering claims can be supported by explanations,
              arguments, and opinions, but more importantly they need to be
              supported by hard evidence and knowledge bits. Knowledge bits are
              files, containing simulation results, experimental results,
              detailed analysis, datasets, mathematical formulations, scripts,
              source code, reviews, reproduction of results, assumptions,
              hypothesis, methodologies, videos, etc. Knowledge bits are the
              hidden backbone, the atomic particles composing a
              scientific/engineering work, while the associated publication is
              merely its projection on a piece of (digital) paper.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Twitter integration
            </Typography>
            <Typography variant="body1">
              If you encounter a tweet making a science/engineering claim, then
              use #FFclaimit on Twitter to automatically host the claim on
              Fractal Flows. The Fractal Flows bot will then tweet back with a
              link to the hosted claim page for everyone to see and engage.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h5" component="h3">
              Consider.it integration
            </Typography>
            <Typography variant="body1">
              Visually summarizing what the society/community thinks of a
              science/engineering claim and why. Consider.it creates civil,
              organized, and efficient online dialog.{" "}
              <a
                href="https://consider.it/"
                rel="noreferrer"
                className="styled-link"
                target="_blank"
              >
                Learn more
              </a>
              .
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default About;
