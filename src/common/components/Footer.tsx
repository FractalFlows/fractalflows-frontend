import { FC } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import styles from "./Footer.module.css";

const FooterIconsItem: FC<{
  href: string;
  title: string;
  icon: string;
  bgColor: string;
}> = ({ href, title, icon, bgColor }) => (
  <a
    target="_blank"
    rel="noreferrer"
    href={href}
    // style={{ backgroundColor: bgColor }}
    title={title}
  >
    <IconButton size="large" aria-label="upload picture" component="span">
      <i className={`fab fa-${icon}`} />
    </IconButton>
  </a>
);

const Footer: FC = () => (
  <footer className={styles.footer}>
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} justifyContent="center">
        <FooterIconsItem
          href="https://twitter.com/FractalFlows"
          bgColor="#1da1f2"
          title="Twitter"
          icon="twitter"
        />

        <FooterIconsItem
          href="https://medium.com/@FractalFlows"
          bgColor="#00ab6b"
          title="Medium"
          icon="medium"
        />
        <FooterIconsItem
          href="https://www.reddit.com/user/FractalFlows"
          bgColor="#ff4500"
          title="Reddit"
          icon="reddit-alien"
        />

        <FooterIconsItem
          href="https://www.linkedin.com/company/fractal-flows-ivs/"
          bgColor="#0077b5"
          title="LinkedIn"
          icon="linkedin"
        />
      </Stack>

      <Stack direction="row" justifyContent="center">
        <Typography>
          Copyright &copy; {new Date().getFullYear()} Fractal Flows. All Rights
          Reserved.
        </Typography>
      </Stack>
    </Stack>
  </footer>
);

export default Footer;
