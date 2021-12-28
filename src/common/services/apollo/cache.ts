import { InMemoryCache } from "@apollo/client";

import { AuthCache } from "modules/auth/cache";
import { Session } from "modules/auth/interfaces";

const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        session: {
          read: () => {
            const sessionVar = AuthCache.sessionVar();

            return {
              ...sessionVar,
              username: sessionVar.ens ?? sessionVar?.siweMessage?.address,
            };
          },
        },
        isSignedIn: {
          read: () => AuthCache.isSignedInVar(),
        },
      },
    },
  },
};
export const cache = new InMemoryCache(cacheOptions);