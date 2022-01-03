import { InMemoryCache } from "@apollo/client";

import { AuthCache } from "modules/auth/cache";

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
      },
    },
  },
};
export const cache = new InMemoryCache(cacheOptions);
