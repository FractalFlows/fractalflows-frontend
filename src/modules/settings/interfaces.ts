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
