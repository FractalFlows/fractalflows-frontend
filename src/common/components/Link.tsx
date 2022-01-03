import { FC } from "react";
import NextLink, { LinkProps } from "next/link";

export const Link: FC<LinkProps> = ({ children, ...props }) => (
  <NextLink {...props} passHref>
    <a style={{ display: "flex" }}>{children}</a>
  </NextLink>
);
