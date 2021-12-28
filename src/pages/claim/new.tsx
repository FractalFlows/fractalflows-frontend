import type { NextPage } from "next";
import Image from "next/image";
import {
  Box,
  Autocomplete,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";

import SocialIdeasIllustration from "../../../public/illustrations/social_ideas.svg";

const NewClaim: NextPage = () => {
  const { control, register } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "sources", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );
  return (
    <Box className="container page">
      <Stack direction="row" spacing={20}>
        <Box>
          <Image src={SocialIdeasIllustration} alt="Social ideas" />
        </Box>
        <Stack
          direction="column"
          spacing={5}
          sx={{ width: "600px" }}
          justifySelf="flexEnd"
        >
          <Typography variant="h3" component="h1">
            Host new claim
          </Typography>
          <form>
            <Stack spacing={3}>
              <TextField label="Title" variant="standard" fullWidth></TextField>
              <TextField
                label="Summary"
                variant="standard"
                rows={4}
                maxRows={Infinity}
                multiline
                fullWidth
              ></TextField>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
                    Sources
                  </Typography>
                  <Typography variant="body2">
                    It is important to point out all the relevant sources of
                    your claim. Click on the icons to add different source
                    types.
                  </Typography>
                </Box>
                {fields.map((field, index) => (
                  <Box key={field.id}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={10}
                      label="Age"
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    {/* <input {...register(`test.${index}.value`)} /> */}
                  </Box>
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  fullWidth
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
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Add tag"
                    />
                  )}
                />
              </Stack>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "800" }}>
                    Attributions
                  </Typography>
                  <Typography variant="body2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sequi a illo temporibus possimus iure deserunt, voluptas,
                    dolorum.
                  </Typography>
                </Box>
                {fields.map((field, index) => (
                  <input
                    key={field.id} // important to include key with field's id
                    {...register(`test.${index}.value`)}
                  />
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  fullWidth
                >
                  Add attribution
                </Button>
              </Stack>
              <Button variant="contained" size="large">
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
