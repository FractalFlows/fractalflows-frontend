import type { NextPage } from "next";
import Image from "next/image";
import {
  Box,
  FormControl,
  InputLabel,
  Autocomplete,
  IconButton,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";

import SocialIdeasIllustration from "../../../public/illustrations/social_ideas.svg";
import { useFormErrorMessage } from "common/hooks/useFormErrorMessage";
import { registerMui } from "common/utils/registerMui";

const NewClaim: NextPage = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
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

  return (
    <Box className="container page">
      <Stack direction="row" spacing={15}>
        <Box>
          <Image src={SocialIdeasIllustration} alt="Social ideas" />
        </Box>
        <Stack
          direction="column"
          spacing={6}
          sx={{ maxWidth: "550px" }}
          justifySelf="flexEnd"
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700 }}
            align="center"
          >
            Host new claim
          </Typography>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
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
                    your claim. Click on the icons to add different source
                    types.
                  </Typography>
                </Box>

                {sourcesFields.map((sourceField, sourceFieldIndex) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    key={sourceField.id}
                    alignItems="flexEnd"
                  >
                    <FormControl>
                      <InputLabel id="sources-origin-select-label">
                        Origin
                      </InputLabel>
                      <Select
                        labelId="sources-origin-select-label"
                        // value={10}
                        label="Origin"
                        sx={{ width: 150 }}
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
                    </FormControl>
                    <TextField
                      label="URL"
                      sx={{ flexGrow: 1 }}
                      {...registerMui({
                        register,
                        name: `sources.${sourceFieldIndex}.url`,
                        props: {
                          required: true,
                        },
                        errors,
                      })}
                    ></TextField>
                    <IconButton
                      size="medium"
                      aria-label="Delete source"
                      component="span"
                      onClick={() => removeSource(sourceFieldIndex)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </Stack>
                ))}
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
                  multiple
                  options={[{ title: "Test", id: 123 }]}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Add tag" />
                  )}
                />
              </Stack>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
                    Attributions
                  </Typography>
                  <Typography variant="body2">
                    An e-mail or Twitter handle profile link to the original
                    claimant.
                  </Typography>
                </Box>
                {attributionsFields.map(
                  (attributionsField, attributionsFieldIndex) => (
                    <Stack
                      direction="row"
                      spacing={2}
                      key={attributionsField.id}
                      alignItems="flexEnd"
                    >
                      <FormControl>
                        <InputLabel id="attributions-origin-select-label">
                          Origin
                        </InputLabel>
                        <Select
                          labelId="attributions-origin-select-label"
                          label="Origin"
                          sx={{ width: 150 }}
                          {...registerMui({
                            register,
                            name: `attributions.${attributionsFieldIndex}.origin`,
                            props: {
                              required: true,
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
                      </FormControl>
                      <TextField
                        label="URL"
                        sx={{ flexGrow: 1 }}
                        {...registerMui({
                          register,
                          name: `attributions.${attributionsFieldIndex}.identifier`,
                          props: {
                            required: true,
                          },
                          errors,
                        })}
                      ></TextField>
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
                    </Stack>
                  )
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
              <Button type="submit" variant="contained" size="large">
                Host claim
              </Button>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NewClaim;
