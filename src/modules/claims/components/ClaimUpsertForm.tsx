import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray, NestedValue } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { get } from "lodash-es";

import {
  Autocomplete,
  AutocompleteOptionProps,
} from "common/components/Autocomplete";
import { Select } from "common/components/Select";
import { useClaims } from "modules/claims/hooks/useClaims";
import { useTags } from "modules/tags/hooks/useTags";
import type {
  AttributionProps,
  ClaimProps,
  SourceProps,
} from "modules/claims/interfaces";
import type { TagProps } from "modules/tags/interfaces";
import {
  validateDOI,
  validateEmail,
  validateTwitterHandle,
  validateURL,
  validateURLWithHostname,
} from "common/utils/validate";
import { registerMui } from "common/utils/registerMui";
import { mapArray } from "common/utils/mapArray";

export enum ClaimUpsertFormOperation {
  CREATE,
  UPDATE,
}

const ClaimUpsertFormOperationText = {
  [ClaimUpsertFormOperation.CREATE]: {
    pageTitle: "Host new claim",
    submitButton: "Host claim",
    successFeedback: "Your new claim has been succesfully added!",
  },
  [ClaimUpsertFormOperation.UPDATE]: {
    pageTitle: "Edit claim",
    submitButton: "Edit claim",
    successFeedback: "Your claim has been succesfully edited!",
  },
};

interface ClaimUpsertFormProps {
  claim?: ClaimProps;
  operation?: ClaimUpsertFormOperation;
}

export const ClaimUpsertForm: FC<ClaimUpsertFormProps> = ({
  claim,
  operation = ClaimUpsertFormOperation.UPDATE,
}) => {
  const { createClaim, updateClaim } = useClaims();
  const { searchTags } = useTags();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<{
    title: string;
    summary: string;
    tags: NestedValue<TagProps[]>;
    sources: NestedValue<SourceProps[]>;
    attributions: NestedValue<AttributionProps[]>;
  }>({
    defaultValues: {
      title: get(claim, "title", ""),
      summary: get(claim, "summary", ""),
      tags: mapArray(claim?.tags, ["id", "label"]) as TagProps[],
      sources: mapArray(claim?.sources, [
        "id",
        "origin",
        "url",
      ]) as SourceProps[],
      attributions: mapArray(claim?.attributions, [
        "id",
        "origin",
        "identifier",
      ]) as AttributionProps[],
    },
  });
  const {
    fields: sourcesFields,
    append: appendSource,
    remove: removeSource,
  } = useFieldArray({
    control,
    name: "sources",
  });
  const {
    fields: attributionsFields,
    append: appendAttribution,
    remove: removeAttribution,
  } = useFieldArray({
    control,
    name: "attributions",
  });

  const [tagsOptions, setTagsOptions] = useState<AutocompleteOptionProps[]>([]);
  const [tagsOptionsLoading, setTagsOptionsLoading] = useState(false);

  const sourcesOriginOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "reddit", label: "Reddit" },
    { value: "linkedIn", label: "LinkedIn" },
    { value: "quora", label: "Quora" },
    { value: "doi", label: "DOI" },
    { value: "website", label: "Website" },
    { value: "other", label: "Other" },
  ];
  const attributionsOriginOptions = [
    { value: "twitter", label: "Twitter" },
    { value: "email", label: "Email" },
  ];

  const handleSubmit = async (data: ClaimProps) => {
    try {
      const { slug } = await (operation === ClaimUpsertFormOperation.CREATE
        ? createClaim({ claim: data })
        : updateClaim({ id: claim?.id as string, claim: data }));
      enqueueSnackbar(ClaimUpsertFormOperationText[operation].successFeedback, {
        variant: "success",
      });
      router.push(`/claim/${slug}`);
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  const handleTagsSearch = useCallback(
    async (term?: string) => {
      setTagsOptionsLoading(true);

      try {
        const tags = await searchTags({ term });
        setTagsOptions(tags.map(({ id, label }: TagProps) => ({ id, label })));
      } catch (e: any) {
        enqueueSnackbar(e.message, {
          variant: "error",
        });
      } finally {
        setTagsOptionsLoading(false);
      }
    },
    [enqueueSnackbar, searchTags]
  );

  useEffect(() => {
    handleTagsSearch();
  }, []);

  return (
    <Stack alignItems="center">
      <Stack spacing={6}>
        <Typography variant="h3" component="h1" align="center">
          {ClaimUpsertFormOperationText[operation].pageTitle}
        </Typography>
        <form onSubmit={handleSubmitHook(handleSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              {...registerMui({
                register,
                name: "title",
                props: {
                  required: true,
                },
                errors,
              })}
            ></TextField>
            <TextField
              label="Summary"
              multiline
              minRows={4}
              maxRows={Infinity}
              fullWidth
              {...registerMui({
                register,
                name: "summary",
                props: {
                  required: true,
                },
                errors,
              })}
            ></TextField>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Sources
                </Typography>
                <Typography variant="body2">
                  It is important to point out all the relevant sources of your
                  claim.
                </Typography>
              </Box>
              {sourcesFields.map((sourceField, sourceFieldIndex) => {
                const origin: string = watch(
                  `sources.${sourceFieldIndex}.origin`
                );
                const urlLabels: Record<string, string> = {
                  doi: "DOI",
                  other: "Source",
                };
                const DeleteSourceButton = ({ display }: any) => (
                  <Box sx={{ display }}>
                    <IconButton
                      size="medium"
                      aria-label="Delete source"
                      component="span"
                      onClick={() => removeSource(sourceFieldIndex)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </Box>
                );

                return (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    key={sourceField.id}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      flexGrow={1}
                    >
                      <Select
                        label="Origin"
                        name={`sources.${sourceFieldIndex}.origin`}
                        fullWidth
                        sx={{ width: { xs: "unset", sm: 150 } }}
                        options={sourcesOriginOptions}
                        control={control}
                        errors={errors}
                        rules={{
                          required: true,
                          deps: [`sources.${sourceFieldIndex}.url`],
                        }}
                      />
                      <TextField
                        label={urlLabels[origin] || "URL"}
                        sx={{ flexGrow: 1 }}
                        {...registerMui({
                          register,
                          name: `sources.${sourceFieldIndex}.url`,
                          props: {
                            required: true,
                            validate: {
                              url: (url: string) => {
                                if (origin === "website") {
                                  return validateURL(url);
                                } else if (
                                  origin !== "doi" &&
                                  origin !== "other"
                                ) {
                                  return validateURLWithHostname(url, origin);
                                } else {
                                  return true;
                                }
                              },
                              doi: (doi: string) =>
                                origin === "doi" ? validateDOI(doi) : true,
                            },
                          },
                          errors,
                        })}
                      ></TextField>
                      <DeleteSourceButton
                        display={{ xs: "none", sm: "flex" }}
                      />
                    </Stack>
                    <DeleteSourceButton display={{ xs: "flex", sm: "none" }} />
                  </Stack>
                );
              })}
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                onClick={() => appendSource({ origin: "facebook", url: "" })}
              >
                Add source
              </Button>
            </Stack>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Tags
                </Typography>
                <Typography variant="body2">
                  Tags are important for better organizing our content please
                  choose them wisely you have 4 possibilities. Write a tag and
                  press enter or tab to save it.
                </Typography>
              </Box>
              <Autocomplete
                control={control}
                multiple
                errors={errors}
                options={tagsOptions}
                loading={tagsOptionsLoading}
                label="Tags"
                name="tags"
                maxTags={4}
                freeSolo
                filterOptions={(option) => option}
                onSearch={handleTagsSearch}
              />
            </Stack>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Attributions
                </Typography>
                <Typography variant="body2">
                  Add an e-mail or Twitter handle profile link to the original
                  claimant.
                </Typography>
              </Box>
              {attributionsFields.map(
                (attributionsField, attributionsFieldIndex) => {
                  const origin: string = watch(
                    `attributions.${attributionsFieldIndex}.origin`
                  );
                  const DeleteAttributionButton = ({ display }: any) => (
                    <Box sx={{ display }}>
                      <IconButton
                        size="medium"
                        aria-label="Delete attribution"
                        component="span"
                        onClick={() =>
                          removeAttribution(attributionsFieldIndex)
                        }
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </Box>
                  );

                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      key={attributionsField.id}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        flexGrow={1}
                      >
                        <Select
                          label="Origin"
                          name={`attributions.${attributionsFieldIndex}.origin`}
                          fullWidth
                          sx={{ width: { xs: "unset", sm: 150 } }}
                          options={attributionsOriginOptions}
                          control={control}
                          errors={errors}
                          rules={{
                            required: true,
                            deps: [
                              `attributions.${attributionsFieldIndex}.identifier`,
                            ],
                          }}
                        />

                        <TextField
                          label={origin === "twitter" ? "Handle" : "Email"}
                          sx={{ flexGrow: 1 }}
                          {...registerMui({
                            register,
                            name: `attributions.${attributionsFieldIndex}.identifier`,
                            props: {
                              required: true,
                              validate: {
                                email: (identifier: string) =>
                                  origin === "email"
                                    ? validateEmail(identifier)
                                    : true,
                                twitterHandle: (identifier: string) =>
                                  origin === "twitter"
                                    ? validateTwitterHandle(identifier)
                                    : true,
                              },
                            },
                            errors,
                          })}
                        ></TextField>
                        <DeleteAttributionButton
                          display={{ xs: "none", sm: "flex" }}
                        />
                      </Stack>
                      <DeleteAttributionButton
                        display={{ xs: "flex", sm: "none" }}
                      />
                    </Stack>
                  );
                }
              )}
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                onClick={() =>
                  appendAttribution({ origin: "twitter", identifier: "" })
                }
              >
                Add attribution
              </Button>
            </Stack>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              size="large"
            >
              {ClaimUpsertFormOperationText[operation].submitButton}
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};
