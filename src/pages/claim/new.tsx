import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
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
import { get, isEmpty } from "lodash-es";

import {
  Autocomplete,
  AutocompleteOptionProps,
} from "common/components/Autocomplete";
import { registerMui } from "common/utils/registerMui";
import { useClaims } from "modules/claims/hooks/useClaims";
import { useTags } from "modules/tags/hooks/useTags";
import { Claim } from "modules/claims/interfaces";
import { Tag } from "modules/tags/interfaces";
import { getFormErrorHelperText } from "common/utils/getFormErrorHelperText";
import {
  validateDOI,
  validateEmail,
  validateTwitterHandle,
  validateURL,
  validateURLWithHostname,
} from "common/utils/validate";
import { useAuth } from "modules/auth/hooks/useAuth";
import { AuthWall } from "common/components/AuthWall";

const NewClaim: NextPage = () => {
  const { createClaim } = useClaims();
  const { searchTags } = useTags();
  const { session } = useAuth();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    register,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit: handleSubmitHook,
  } = useForm<{
    title: string;
    summary: string;
    tags: NestedValue<any[]>;
    sources: NestedValue<any[]>;
    attributions: NestedValue<any[]>;
  }>({
    defaultValues: {
      title: "",
      summary: "",
      tags: [],
      sources: [],
      attributions: [],
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

  const handleSubmit = async (claim: Claim) => {
    try {
      const { slug } = await createClaim({ claim });
      enqueueSnackbar("Your new claim has been succesfully added!", {
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
        setTagsOptions(tags.map(({ id, label }: Tag) => ({ id, label })));
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

  console.log("ses", session);

  useEffect(() => {
    handleTagsSearch();
  }, []);

  if (isEmpty(session)) return <AuthWall />;

  return (
    <Box className="container page">
      <Stack alignItems="center">
        <Stack spacing={6} sx={{ maxWidth: "550px" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700 }}
            align="center"
          >
            Host new claim
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
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    Sources
                  </Typography>
                  <Typography variant="body2">
                    It is important to point out all the relevant sources of
                    your claim.
                  </Typography>
                </Box>

                {sourcesFields.map((sourceField, sourceFieldIndex) => {
                  const origin: string = getValues(
                    `sources.${sourceFieldIndex}.origin`
                  );
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
                        <FormControl>
                          <InputLabel
                            id="sources-origin-select-label"
                            error={get(
                              errors,
                              `sources.${sourceFieldIndex}.origin`
                            )}
                          >
                            Origin
                          </InputLabel>
                          <Select
                            labelId="sources-origin-select-label"
                            label="Origin"
                            fullWidth
                            sx={{ width: { xs: "unset", sm: 150 } }}
                            {...registerMui({
                              register,
                              name: `sources.${sourceFieldIndex}.origin`,
                              props: {
                                required: true,
                              },
                              errors,
                            })}
                          >
                            {sourcesOriginOptions.map((sourcesOriginOption) => (
                              <MenuItem
                                value={sourcesOriginOption.value}
                                key={sourcesOriginOption.value}
                              >
                                {sourcesOriginOption.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {getFormErrorHelperText(
                            errors,
                            `sources.${sourceFieldIndex}.origin`
                          )}
                        </FormControl>
                        <TextField
                          label={origin === "doi" ? "DOI" : "URL"}
                          sx={{ flexGrow: 1 }}
                          {...registerMui({
                            register,
                            name: `sources.${sourceFieldIndex}.url`,
                            props: {
                              required: true,
                              validate: {
                                url: (url: string) => {
                                  if (
                                    origin === "other" ||
                                    origin === "website"
                                  ) {
                                    return validateURL(url);
                                  } else if (origin !== "doi") {
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
                      <DeleteSourceButton
                        display={{ xs: "flex", sm: "none" }}
                      />
                    </Stack>
                  );
                })}
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  fullWidth
                  onClick={() => appendSource({})}
                >
                  Add source
                </Button>
              </Stack>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
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
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
                    Attributions
                  </Typography>
                  <Typography variant="body2">
                    Add an e-mail or Twitter handle profile link to the original
                    claimant.
                  </Typography>
                </Box>
                {attributionsFields.map(
                  (attributionsField, attributionsFieldIndex) => {
                    const origin: string = getValues(
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
                          <FormControl>
                            <InputLabel
                              id="attributions-origin-select-label"
                              error={get(
                                errors,
                                `attributions.${attributionsFieldIndex}.origin`
                              )}
                            >
                              Origin
                            </InputLabel>
                            <Select
                              labelId="attributions-origin-select-label"
                              label="Origin"
                              fullWidth
                              sx={{ width: { xs: "unset", sm: 150 } }}
                              {...registerMui({
                                register,
                                name: `attributions.${attributionsFieldIndex}.origin`,
                                props: {
                                  required: true,
                                  deps: [
                                    `attributions.${attributionsFieldIndex}.url`,
                                  ],
                                },
                                errors,
                              })}
                            >
                              {attributionsOriginOptions.map(
                                (attributionsOriginOption) => (
                                  <MenuItem
                                    value={attributionsOriginOption.value}
                                    key={attributionsOriginOption.value}
                                  >
                                    {attributionsOriginOption.label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {getFormErrorHelperText(
                              errors,
                              `attributions.${attributionsFieldIndex}.origin`
                            )}
                          </FormControl>
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
                  onClick={() => appendAttribution({})}
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
                Host claim
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NewClaim;
