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

export interface ClaimProps {
  title: string;
  summary: string;
  slug: string;
  sources?: Source[];
  tags?: Tag[];
  attributions?: Attributions[];
}
