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

export enum AttributionOrigins {
  TWITTER = "twitter",
  EMAIL = "email",
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

export enum KnowledgeBitTypesLabels {
  PUBLICATION_OR_ARTICLE_OR_REPORT = "Publication/Article/Report",
  SIMULATION_RESULTS = "Simulation Results",
  EXPERIMENTAL_RESULTS = "Experimental Results",
  DETAILED_ANALYSIS = "Detailed Analysis",
  DATA_SET = "Data Set",
  DETAILED_MATHEMATICAL_FORMULATION = "Detailed Mathematical Formulations",
  SCRIPTS = "Scripts",
  SOURCE_CODE = "Source Code",
  REVIEWS = "Reviews",
  REPRODUCTION_OF_RESULTS = "Reproduction of Results",
  STATEMENT_OF_ASSUMPTIONS = "Statement of Assumptions",
  STATEMENT_OF_HYPOTHESIS = "Statement of Hypothesis",
  DESCRIPTION_OF_METHODOLOGIES = "Description of Methodologies",
  OTHER = "Other (please specify)",
}

export enum KnowledgeBitSides {
  REFUTING = "REFUTING",
  SUPPORTING = "SUPPORTING",
}

export enum KnowledgeBitVoteTypes {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  UNVOTE = "UNVOTE",
}

export interface KnowledgeBitProps {
  id: string;
  name: string;
  side: KnowledgeBitSides;
  summary?: string;
  type: KnowledgeBitTypes;
  customType?: string;
  file: File;
  fileURI?: string;
  nftTxHash: string;
  nftTokenId: string;
  nftMetadataURI: string;
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
  nftTxHash?: string;
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
  nftTokenId: string;
  nftTxHash: string;
  nftMetadataURI: string;
}
