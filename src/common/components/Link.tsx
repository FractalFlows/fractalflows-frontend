import { FC } from "react";
import NextLink, { LinkProps } from "next/link";

import styles from "./Link.module.css";

export const Link: FC<LinkProps & { text?: boolean }> = ({
  children,
  text,
  ...props
}) => (
  <NextLink {...props} passHref>
    <a className={text ? styles.text : styles.block}>{children}</a>
  </NextLink>
);
