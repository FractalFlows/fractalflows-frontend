export interface UserProps {
  id: string;
  username: string;
  avatar?: string;
  ethAddress?: string;
  twitter?: string;
}

export interface ProfileProps {
  username: string;
  avatar?: string;
  ethAddress?: string;
}

export enum UserRole {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
  VALIDATOR = "VALIDATOR",
}

export interface GetProfileProps {
  username: string;
}
