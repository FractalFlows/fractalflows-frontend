import type { FC } from "react";
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
import { get, isEmpty } from "lodash-es";

import { Select } from "common/components/Select";
import { useClaims } from "modules/claims/hooks/useClaims";
import {
  AttributionProps,
  KnowledgeBitLocations,
  KnowledgeBitProps,
  KnowledgeBitSides,
  KnowledgeBitTypes,
} from "modules/claims/interfaces";
import {
  validateEmail,
  validateTwitterHandle,
  validateURL,
} from "common/utils/validate";
import { registerMui } from "common/utils/registerMui";
import { mapArray } from "common/utils/mapArray";

const knowledgeBitTypesOptions = [
  {
    value: KnowledgeBitTypes.PUBLICATION_OR_ARTICLE_OR_REPORT,
    label: "Publication/Article/Report",
  },
  { value: KnowledgeBitTypes.SIMULATION_RESULTS, label: "Simulation Results" },
  {
    value: KnowledgeBitTypes.EXPERIMENTAL_RESULTS,
    label: "Experimental Results",
  },
  { value: KnowledgeBitTypes.DETAILED_ANALYSIS, label: "Detailed Analysis" },
  { value: KnowledgeBitTypes.DATA_SET, label: "Data Set" },
  {
    value: KnowledgeBitTypes.DETAILED_MATHEMATICAL_FORMULATION,
    label: "Detailed Mathematical Formulations",
  },
  { value: KnowledgeBitTypes.SCRIPTS, label: "Scripts" },
  { value: KnowledgeBitTypes.SOURCE_CODE, label: "Source Code" },
  { value: KnowledgeBitTypes.REVIEWS, label: "Reviews" },
  {
    value: KnowledgeBitTypes.REPRODUCTION_OF_RESULTS,
    label: "Reproduction of Results",
  },
  {
    value: KnowledgeBitTypes.STATEMENT_OF_ASSUMPTIONS,
    label: "Statement of Assumptions",
  },
  {
    value: KnowledgeBitTypes.STATEMENT_OF_HYPOTHESIS,
    label: "Statement of Hypothesis",
  },
  {
    value: KnowledgeBitTypes.DESCRIPTION_OF_METHODOLOGIES,
    label: "Description of Methodologies",
  },
  { value: KnowledgeBitTypes.OTHER, label: "Other (please specify)" },
];

const knowledgeBitLocationsOptions = [
  { value: KnowledgeBitLocations.EMAIL, label: "Email" },
  { value: KnowledgeBitLocations.WEBSITE, label: "Website" },
  { value: KnowledgeBitLocations.PDF, label: "PDF file" },
  { value: KnowledgeBitLocations.DATABASE, label: "Database" },
  { value: KnowledgeBitLocations.GIT, label: "Git/GitHub/BitBucket" },
  { value: KnowledgeBitLocations.DROPBOX, label: "Dropbox" },
  { value: KnowledgeBitLocations.BOX, label: "Box" },
  { value: KnowledgeBitLocations.GOOGLE_DRIVE, label: "Google Drive" },
  { value: KnowledgeBitLocations.ONEDRIVE, label: "OneDrive" },
  { value: KnowledgeBitLocations.STACK_OVERFLOW, label: "Stack Overflow" },
  { value: KnowledgeBitLocations.FIGSHARE, label: "Figshare" },
  { value: KnowledgeBitLocations.SLIDESHARE, label: "SlideShare" },
  { value: KnowledgeBitLocations.KAGGLE, label: "Kaggle" },
  { value: KnowledgeBitLocations.IPFS, label: "IPFS" },
  { value: KnowledgeBitLocations.DAT, label: "Dat" },
  { value: KnowledgeBitLocations.JUPYTER, label: "Jupyter" },
  { value: KnowledgeBitLocations.BLOG, label: "Blog" },
  { value: KnowledgeBitLocations.YOUTUBE, label: "YouTube" },
  {
    value: KnowledgeBitLocations.SCIENTIFIC_PUBLISHER,
    label: "Scientific Publisher",
  },
  { value: KnowledgeBitLocations.PUBPEER, label: "PubPeer" },
  { value: KnowledgeBitLocations.ZENODO, label: "Zenodo" },
  { value: KnowledgeBitLocations.OPENAIRE, label: "OpenAire" },
  { value: KnowledgeBitLocations.RE3DATA, label: "re3Data" },
  { value: KnowledgeBitLocations.ETHEREUM_SWARM, label: "Ethereum Swarm" },
  { value: KnowledgeBitLocations.BIT_TORRENT, label: "BitTorrent" },
  { value: KnowledgeBitLocations.RESEARCH_GATE, label: "ResearchGate" },
  { value: KnowledgeBitLocations.ACADEMIA_EDU, label: "Academia.edu" },
  { value: KnowledgeBitLocations.RESEARCH_ID, label: "ResearchID" },
  { value: KnowledgeBitLocations.HAL_ARCHIVES, label: "HAL-Archives" },
  { value: KnowledgeBitLocations.ARXIV, label: "arXiv" },
  { value: KnowledgeBitLocations.WIKIPEDIA, label: "Wikipedia" },
  { value: KnowledgeBitLocations.OTHER, label: "Other (please specify)" },
];

const KnowledgeBitLocationsAttributionOrigins = [
  { value: "twitter", label: "Twitter" },
  { value: "email", label: "Email" },
];

export enum KnowledgeBitUpsertFormOperation {
  CREATE,
  UPDATE,
}

const KnowledgeBitUpsertFormOperationText = {
  [KnowledgeBitUpsertFormOperation.CREATE]: {
    formTitle: "Add Knowledge Bit",
    submitButton: "Add Knowledge Bit",
    successFeedback: "Your new Knowledge Bit has been succesfully added!",
  },
  [KnowledgeBitUpsertFormOperation.UPDATE]: {
    formTitle: "Edit Knowledge Bit",
    submitButton: "Edit Knowledge Bit",
    successFeedback: "Your Knowledge Bit has been succesfully edited!",
  },
};

interface KnowledgeBitUpsertProps {
  knowledgeBit?: KnowledgeBitProps;
  handleClose: () => any;
  operation?: KnowledgeBitUpsertFormOperation;
}

interface KnowledgeBitUpsertFormProps {
  name: string;
  summary?: string;
  side: KnowledgeBitSides;
  type: string;
  customType?: string;
  location: string;
  customLocation?: string;
  url: string;
  attributions: NestedValue<AttributionProps[]>;
}

export const KnowledgeBitUpsert: FC<KnowledgeBitUpsertProps> = ({
  knowledgeBit,
  handleClose,
  operation = KnowledgeBitUpsertFormOperation.CREATE,
}) => {
  const { createKnowledgeBit, updateKnowledgeBit } = useClaims();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    control,
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmitHook,
  } = useForm<KnowledgeBitUpsertFormProps>({
    defaultValues: {
      name: get(knowledgeBit, "title", ""),
      summary: get(knowledgeBit, "summary", ""),
      side: get(knowledgeBit, "side"),
      type: get(knowledgeBit, "type", ""),
      customType: get(knowledgeBit, "customType", ""),
      location: get(knowledgeBit, "location", ""),
      customLocation: get(knowledgeBit, "customLocation", ""),
      url: get(knowledgeBit, "link", ""),
      attributions: mapArray(knowledgeBit?.attributions, [
        "id",
        "origin",
        "identifier",
      ]) as AttributionProps[],
    },
  });
  const {
    fields: attributionsFields,
    append: appendAttribution,
    remove: removeAttribution,
  } = useFieldArray({
    control,
    name: "attributions",
  });

  const handleSubmit = async (data: KnowledgeBitProps) => {
    const { slug } = router.query;

    try {
      await (operation === KnowledgeBitUpsertFormOperation.CREATE
        ? createKnowledgeBit({ claimSlug: slug as string, knowledgeBit: data })
        : updateKnowledgeBit({
            id: knowledgeBit?.id as string,
            knowledgeBit: data,
          }));
      enqueueSnackbar(
        KnowledgeBitUpsertFormOperationText[operation].successFeedback,
        {
          variant: "success",
        }
      );
      handleClose();
    } catch (e: any) {
      enqueueSnackbar(e.message, {
        variant: "error",
      });
    }
  };

  const knowledgeBitType = watch("type");
  const knowledgeBitLocation = watch("location");

  return (
    <Stack alignItems="center" spacing={3}>
      <Typography variant="h5">
        {KnowledgeBitUpsertFormOperationText[operation].formTitle}
      </Typography>
      <form onSubmit={handleSubmitHook(handleSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            fullWidth
            {...registerMui({
              register,
              name: "name",
              props: {
                required: true,
              },
              errors,
            })}
          ></TextField>
          <TextField
            label="Summary (optional)"
            multiline
            minRows={4}
            maxRows={Infinity}
            fullWidth
            {...registerMui({
              register,
              name: "summary",
              errors,
            })}
          ></TextField>
          <Select
            label="Type"
            name="type"
            fullWidth
            options={knowledgeBitTypesOptions}
            control={control}
            errors={errors}
            rules={{
              required: true,
              deps: ["customType"],
            }}
          />
          {knowledgeBitType === KnowledgeBitTypes.OTHER ? (
            <TextField
              label="Other type"
              fullWidth
              {...registerMui({
                register,
                name: "customType",
                props: {
                  validate: {
                    required: (customType) =>
                      knowledgeBitType === KnowledgeBitTypes.OTHER &&
                      isEmpty(customType) === false,
                  },
                },
                errors,
              })}
            ></TextField>
          ) : null}
          <Select
            label="Location"
            name="location"
            fullWidth
            options={knowledgeBitLocationsOptions}
            control={control}
            errors={errors}
            rules={{
              required: true,
              deps: ["customLocation"],
            }}
          />
          {knowledgeBitLocation === KnowledgeBitLocations.OTHER ? (
            <TextField
              label="Other location"
              fullWidth
              {...registerMui({
                register,
                name: "customLocation",
                props: {
                  validate: {
                    required: (customLocation) =>
                      knowledgeBitLocation === KnowledgeBitLocations.OTHER &&
                      isEmpty(customLocation) === false,
                  },
                },
                errors,
              })}
            ></TextField>
          ) : null}
          <TextField
            label="URL"
            fullWidth
            {...registerMui({
              register,
              name: "url",
              props: {
                required: true,
                validate: {
                  url: (url) => validateURL(url),
                },
              },
              errors,
            })}
          ></TextField>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Attributions
              </Typography>
              <Typography variant="body2">
                Add an e-mail or Twitter handle profile link to the original
                knowledge bit owner.
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
                      onClick={() => removeAttribution(attributionsFieldIndex)}
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
                        options={KnowledgeBitLocationsAttributionOrigins}
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
          <Stack spacing={2}>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              size="large"
            >
              {KnowledgeBitUpsertFormOperationText[operation].submitButton}
            </LoadingButton>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              size="large"
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
