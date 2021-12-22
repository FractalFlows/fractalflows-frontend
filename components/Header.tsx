import { FC } from "react";
import Button from "@mui/material/Button";

import styles from "styles/Header.module.css";

const Header: FC = () => {
  return (
    <header className={styles.container}>
      <Button variant="contained">Host new claim</Button>
      <div style={{ flexGrow: 1 }} />
      <Button variant="contained">Sign in with Ethereum</Button>
    </header>
  );
};

export default Header;
