import { ApolloClient } from "@apollo/client";

import { cache } from "./cache";

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URI,
  credentials: "include",
  cache,
});
