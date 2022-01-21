import { InMemoryCache } from "@apollo/client";
import { AppCache } from "modules/app/cache";

import { AuthCache } from "modules/auth/cache";
import { ClaimsCache } from "modules/claims/cache";

const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        session: {
          read: () => AuthCache.session(),
        },
        isSignedIn: {
          read: () => AuthCache.isSignedIn(),
        },
        trendingClaims: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
        isChangingRoutes: {
          read: () => AppCache.isChangingRoutes(),
        },
        claim: {
          read: () => ClaimsCache.claim(),
        },
        knowledgeBits: {
          read: () => ClaimsCache.knowledgeBits(),
        },
        arguments: {
          read: () => ClaimsCache.arguments(),
        },
        userOpinion: {
          read: () => ClaimsCache.userOpinion(),
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
        userKnowledgeBitVotes: {
          read: () => ClaimsCache.userKnowledgeBitVotes(),
        },
      },
    },
  },
};
export const cache = new InMemoryCache(cacheOptions);
