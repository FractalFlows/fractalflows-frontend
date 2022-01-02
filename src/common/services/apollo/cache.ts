import { InMemoryCache } from "@apollo/client";
import { isEmpty } from "lodash-es";

import { AuthCache } from "modules/auth/cache";

const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        session: {
          read: () => {
            const sessionVar = AuthCache.sessionVar();

            if (isEmpty(sessionVar)) {
              return {};
            } else {
              return {
                ...sessionVar,
                username:
                  sessionVar.ens ||
                  sessionVar.user.email ||
                  sessionVar?.user?.ethAddress,
              };
            }
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
