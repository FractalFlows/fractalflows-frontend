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

export enum UsernameSource {
  ENS = "ENS",
  CUSTOM = "CUSTOM",
}

export enum AvatarSource {
  ENS = "ENS",
  GRAVATAR = "GRAVATAR",
}

export interface UpdateProfileProps {
  usernameSource: UsernameSource;
  username: string;
  avatarSource: AvatarSource;
}

export interface APIKeyProps {
  key: string;
  secret: string;
}
