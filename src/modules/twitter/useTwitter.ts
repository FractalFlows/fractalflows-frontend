import { AuthCache } from "modules/auth/cache";
import { TwitterService } from "./services";

export const requestOAuthUrl = async ({
  callbackUrl,
}: {
  callbackUrl: string;
}): Promise<string> => {
  const url = await TwitterService.requestOAuthUrl({ callbackUrl });
  return url;
};

export const validateOAuth = async ({
  oauthToken,
  oauthVerifier,
}: {
  oauthToken: string;
  oauthVerifier: string;
}): Promise<string> => {
  const twitterUsername = await TwitterService.validateOAuth({
    oauthToken,
    oauthVerifier,
  });
  AuthCache.session({
    ...AuthCache.session,
    user: {
      ...AuthCache.session().user,
      twitter: twitterUsername,
    },
  });
  return twitterUsername;
};

export const useTwitter = () => {
  return {
    requestOAuthUrl,
    validateOAuth,
  };
};
