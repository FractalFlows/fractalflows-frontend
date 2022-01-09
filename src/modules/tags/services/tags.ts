import { apolloClient } from "common/services/apollo/client";

import { SEARCH_TAGS } from "../queries";
import type { TagProps } from "../interfaces";

export const TagsService = {
  async searchTags({ term }: { term?: string }): Promise<TagProps[]> {
    const { data } = await apolloClient.query({
      query: SEARCH_TAGS,
      variables: {
        term,
      },
    });

    return data.searchTags;
  },
};
