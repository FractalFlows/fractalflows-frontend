import { UserProps } from "modules/users/interfaces";

export interface SourceProps {
  id?: string;
  origin: string;
  url: string;
}

export interface TagProps {
  id: string;
  label: string;
}

export interface AttributionsProps {
  id?: string;
  origin: string;
  identifier: string;
}

export interface KnowledgeBitProps {
  id: string;
  label: string;
  summary?: string;
}

export interface ClaimProps {
  id?: string;
  title: string;
  summary: string;
  slug: string;
  sources?: SourceProps[];
  tags?: TagProps[];
  attributions?: AttributionsProps[];
  knowledgeBits?: KnowledgeBitProps[];
  createdAt: Date;
  user: UserProps;
}
