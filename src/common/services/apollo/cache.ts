import { InMemoryCache } from "@apollo/client";

import { AuthCache } from "modules/auth/cache";
import { ClaimsCache } from "modules/claims/cache";

const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        session: {
          read: () => AuthCache.sessionVar(),
        },
        isSignedIn: {
          read: () => AuthCache.isSignedInVar(),
        },
        trendingClaims: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
        arguments: {
          read: () => ClaimsCache.arguments(),
        },
        pickedArguments: {
          read: () => ClaimsCache.pickedArguments(),
        },
        opinion: {
          read: () => ClaimsCache.opinion(),
        },
        opinions: {
          read: () => ClaimsCache.opinions(),
        },
        isOpining: {
          read: () => ClaimsCache.isOpining(),
        },
        showOpinionId: {
          read: () => ClaimsCache.showOpinionId(),
        },
      },
    },
  },
};
export const cache = new InMemoryCache(cacheOptions);
