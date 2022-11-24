import { ApolloClient } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import { cache } from "./cache";

const defaultOptions = {
  query: {
    fetchPolicy: "no-cache",
  },
};

export const apolloClient = new ApolloClient({
  // @ts-ignore
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URI,
    credentials: "include",
  }),
  cache,
  defaultOptions,
});
