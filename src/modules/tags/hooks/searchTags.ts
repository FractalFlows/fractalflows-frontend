import { TagsService } from "../services/tags";

export const searchTags = async ({ term }: { term?: string }) =>
  await TagsService.searchTags({ term });
