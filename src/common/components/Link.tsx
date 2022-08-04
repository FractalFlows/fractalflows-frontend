import { FC } from "react";
import NextLink, { LinkProps } from "next/link";

import styles from "./Link.module.css";

export const Link: FC<LinkProps & { text?: boolean; blank?: boolean }> = ({
  children,
  text,
  blank,
  ...props
}) => (
  <NextLink {...props} passHref>
    <a
      className={text ? styles.text : styles.block}
      {...(blank ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </a>
  </NextLink>
);
