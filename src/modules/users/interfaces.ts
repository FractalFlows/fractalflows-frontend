export interface UserProps {
  id: string;
  username: string;
  avatar?: string;
  ethAddress?: string;
}

export interface ProfileProps {
  username: string;
  avatar?: string;
  ethAddress?: string;
}

export enum UserClaimRelation {
  OWN = "OWN",
  CONTRIBUTED = "CONTRIBUTED",
  FOLLOWING = "FOLLOWING",
}

export enum UserRole {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
  VALIDATOR = "VALIDATOR",
}

export interface GetProfileProps {
  username: string;
  claimsRelation: UserClaimRelation;
}
