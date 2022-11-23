import { FC } from "react";
import NextLink, { LinkProps } from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import styles from "./Link.module.css";

export const Link: FC<
  LinkProps & {
    text?: boolean;
    blank?: boolean;
    maxWidth?: number;
    supressBlankIcon?: boolean;
  }
> = ({ children, text, blank, supressBlankIcon, maxWidth, ...props }) => (
  <NextLink {...props} passHref>
    <a
      className={text ? styles.text : styles.block}
      {...(blank ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      <span
        style={
          maxWidth
            ? {
                display: "inline-block",
                maxWidth,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }
            : {}
        }
      >
        {children}
      </span>
      {blank && supressBlankIcon !== true ? (
        <>
          &nbsp;
          <OpenInNewIcon fontSize="inherit" color="primary" />
        </>
      ) : null}
    </a>
  </NextLink>
);
