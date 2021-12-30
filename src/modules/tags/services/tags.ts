import { apolloClient } from "common/services/apollo/client";

import { SEARCH_TAGS } from "../queries";
import { Tag } from "../interfaces";

export const TagsService = {
  async searchTags({ term }: { term: string }): Promise<Tag[]> {
    const { data } = await apolloClient.query({
      query: SEARCH_TAGS,
      variables: {
        term,
      },
    });

    return data.searchTags;
  },
};
