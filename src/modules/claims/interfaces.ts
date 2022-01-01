import type { SiweMessage } from "siwe";

export interface Source {
  origin: string;
  url: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Attributions {
  origin: string;
  identifier: string;
}

export interface Claim {
  title: string;
  summary: string;
  slug: string;
  sources?: Source[];
  tags?: Tag[];
  attributions?: Attributions[];
}

export enum UserClaimRelation {
  OWN = "OWN",
  CONTRIBUTED = "CONTRIBUTED",
  FOLLOWING = "FOLLOWING",
}
