import { ArgumentCommentProps } from "modules/argument-comments/interfaces";
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

export interface AttributionProps {
  id?: string;
  origin: string;
  identifier: string;
}

export enum KnowledgeBitTypes {
  PUBLICATION_OR_ARTICLE_OR_REPORT = "PUBLICATION_OR_ARTICLE_OR_REPORT",
  SIMULATION_RESULTS = "SIMULATION_RESULTS",
  EXPERIMENTAL_RESULTS = "EXPERIMENTAL_RESULTS",
  DETAILED_ANALYSIS = "DETAILED_ANALYSIS",
  DATA_SET = "DATA_SET",
  DETAILED_MATHEMATICAL_FORMULATION = "DETAILED_MATHEMATICAL_FORMULATION",
  SCRIPTS = "SCRIPTS",
  SOURCE_CODE = "SOURCE_CODE",
  REVIEWS = "REVIEWS",
  REPRODUCTION_OF_RESULTS = "REPRODUCTION_OF_RESULTS",
  STATEMENT_OF_ASSUMPTIONS = "STATEMENT_OF_ASSUMPTIONS",
  STATEMENT_OF_HYPOTHESIS = "STATEMENT_OF_HYPOTHESIS",
  DESCRIPTION_OF_METHODOLOGIES = "DESCRIPTION_OF_METHODOLOGIES",
  OTHER = "OTHER",
}

export enum KnowledgeBitLocations {
  EMAIL = "EMAIL",
  WEBSITE = "WEBSITE",
  PDF = "PDF",
  DATABASE = "DATABASE",
  GIT = "GIT",
  DROPBOX = "DROPBOX",
  BOX = "BOX",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  ONEDRIVE = "ONEDRIVE",
  STACK_OVERFLOW = "STACK_OVERFLOW",
  FIGSHARE = "FIGSHARE",
  SLIDESHARE = "SLIDESHARE",
  KAGGLE = "KAGGLE",
  IPFS = "IPFS",
  DAT = "DAT",
  JUPYTER = "JUPYTER",
  BLOG = "BLOG",
  YOUTUBE = "YOUTUBE",
  SCIENTIFIC_PUBLISHER = "SCIENTIFIC_PUBLISHER",
  PUBPEER = "PUBPEER",
  ZENODO = "ZENODO",
  OPENAIRE = "OPENAIRE",
  RE3DATA = "RE3DATA",
  ETHEREUM_SWARM = "ETHEREUM_SWARM",
  BIT_TORRENT = "BIT_TORRENT",
  RESEARCH_GATE = "RESEARCH_GATE",
  ACADEMIA_EDU = "ACADEMIA_EDU",
  RESEARCH_ID = "RESEARCH_ID",
  HAL_ARCHIVES = "HAL_ARCHIVES",
  ARXIV = "ARXIV",
  WIKIPEDIA = "WIKIPEDIA",
  OTHER = "OTHER",
}

export enum KnowledgeBitSides {
  REFUTING = "REFUTING",
  SUPPORTING = "SUPPORTING",
}

export enum KnowledgeBitVoteTypes {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

export interface KnowledgeBitProps {
  id: string;
  name: string;
  side: KnowledgeBitSides;
  summary?: string;
  type: KnowledgeBitTypes;
  customType?: string;
  location: KnowledgeBitLocations;
  customLocation?: string;
  url: string;
  attributions?: AttributionProps[];
  user: UserProps;
  upvotesCount: number;
  downvotesCount: number;
}

export interface KnowledgeBitVoteProps {
  id: string;
  type: KnowledgeBitVoteTypes;
}

export enum ClaimOrigins {
  FRACTALFLOWS = "FRACTALFLOWS",
  TWITTER = "Twitter",
}

export enum ClaimNFTStatuses {
  NOTMINTED = "NOTMINTED",
  MINTING = "MINTING",
  MINTED = "MINTED",
}

export interface ClaimProps {
  id?: string;
  title: string;
  summary: string;
  slug: string;
  sources?: SourceProps[];
  tags?: TagProps[];
  attributions?: AttributionProps[];
  knowledgeBits?: KnowledgeBitProps[];
  arguments?: ArgumentProps[];
  followers?: UserProps[];
  opinions?: OpinionProps[];
  createdAt: Date;
  user: UserProps;
  tweetId?: string;
  tweetOwner?: string;
  origin?: ClaimOrigins;
  nftStatus?: ClaimNFTStatuses;
  nftTxId?: string;
  nftTokenId?: string;
  nftFractionalizationContractAddress?: string;
}

export interface PaginatedClaimsProps {
  totalCount: number;
  data: ClaimProps[];
}

export interface InviteFriendsProps {
  slug: string;
  emails: string[];
  message?: string;
}

// Consider it

export enum ArgumentSides {
  CON = "CON",
  PRO = "PRO",
}

export interface ArgumentProps {
  id: string;
  summary: string;
  side: ArgumentSides;
  evidences: KnowledgeBitProps[];
  comments: ArgumentCommentProps[];
  opinions: OpinionProps[];
  createdAt: Date;
}

export interface OpinionProps {
  id: string;
  acceptance: number;
  arguments: ArgumentProps[];
  user: UserProps;
  claim: Partial<ClaimProps>;
}
