import { FC } from "react";
import NextLink, { LinkProps } from "next/link";

export const Link: FC<LinkProps> = ({ children, ...props }) => (
  <NextLink {...props}>
    <a style={{ display: "contents" }}>{children}</a>
  </NextLink>
);
