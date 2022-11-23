import {
  AttributionOrigins,
  AttributionProps,
} from "modules/claims/interfaces";

export const getAttributionLink = ({
  origin,
  identifier,
}: AttributionProps) => {
  switch (origin) {
    case AttributionOrigins.EMAIL:
      return `mailto:${identifier}`;
    case AttributionOrigins.TWITTER:
      return `https://twitter.com/${identifier}`;
  }
};
