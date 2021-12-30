import { useState } from "react";
import { Controller } from "react-hook-form";
import { debounce } from "lodash-es";
import {
  Autocomplete as MuiAutocomplete,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";

export const Autocomplete = ({
  control,
  options,
  label,
  defaultValue,
  maxTags,
  name,
  loading,
  onSearch,
  ...autocompleteProps
}) => {
  const [value, setValue] = useState([]);

  return (
    <Controller
      render={({ field: { onChange, ...controllerProps } }) => (
        <MuiAutocomplete
          options={options}
          loading={loading}
          renderOption={(props, option) => (
            <Box {...props} component="li" key={option.id}>
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={debounce((ev) => {
                onSearch(ev.target.value);
              }, 300)}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          onChange={(e, data) => {
            if (typeof data[data.length - 1] === "string") {
              data[data.length - 1] = {
                label: data[data.length - 1],
              };
            }
            if (
              (autocompleteProps.multiple &&
                maxTags &&
                data.length <= maxTags) ||
              !autocompleteProps.multiple
            ) {
              onChange(data);
              setValue(data);
            }
          }}
          {...autocompleteProps}
          {...controllerProps}
          value={value}
        />
      )}
      onChange={([, data]) => data}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
};
