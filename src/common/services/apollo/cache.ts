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
