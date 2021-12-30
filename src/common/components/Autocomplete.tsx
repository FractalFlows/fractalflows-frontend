import { useState } from "react";
import { Controller } from "react-hook-form";
import { debounce, last } from "lodash-es";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";

export interface AutocompleteOptionProps {
  id?: string;
  label: string;
}

export interface AutocompleteProps {
  control: any;
  options: AutocompleteOptionProps[];
  label: string;
  defaultValue?: string;
  maxTags?: number;
  name: string;
  loading?: boolean;
  onSearch: (p: any) => any;
  multiple?: boolean;
  freeSolo?: boolean;
}

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
}: AutocompleteProps) => {
  const [value, setValue] = useState<AutocompleteOptionProps[]>([]);

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
            const value = last(data);

            if (typeof value === "string" && typeof data === "object") {
              data[data.length - 1] = {
                label: value,
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
