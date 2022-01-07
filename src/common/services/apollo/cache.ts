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
        isOpining: {
          read: () => ClaimsCache.isOpining(),
        },
      },
    },
  },
};
export const cache = new InMemoryCache(cacheOptions);
