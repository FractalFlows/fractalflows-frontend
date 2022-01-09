import { Controller, FieldErrors } from "react-hook-form";
import { debounce, last, get } from "lodash-es";
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { getFormErrorHelperText } from "common/utils/getFormErrorHelperText";

export interface AutocompleteOptionProps {
  id?: string;
  label: string;
}

export interface AutocompleteProps {
  control: any;
  options: AutocompleteOptionProps[];
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  maxTags?: number;
  name: string;
  loading?: boolean;
  onSearch?: (p: any) => any;
  multiple?: boolean;
  freeSolo?: boolean;
  rules?: any;
  errors: FieldErrors;
  filterOptions?: (option: any) => any;
}

export const Autocomplete = ({
  control,
  options,
  label,
  placeholder,
  defaultValue,
  maxTags,
  name,
  loading,
  onSearch,
  rules,
  errors,
  ...autocompleteProps
}: AutocompleteProps) => (
  <Box>
    <Controller
      render={({ field: { onChange, ...controllerProps } }) => (
        <MuiAutocomplete
          options={options}
          loading={loading}
          renderOption={(props, option) => (
            <Box {...props} component="li" key={get(option, "id", option)}>
              {get(option, "label", option)}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={debounce((ev) => {
                onSearch && onSearch(ev.target.value);
              }, 300)}
              label={label}
              placeholder={placeholder}
              error={!!get(errors, name)}
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
            if (autocompleteProps.multiple && Array.isArray(data)) {
              const value = last(data);

              if (typeof value === "string") {
                data[data.length - 1] = {
                  label: value,
                };
              }

              if ((maxTags && data.length <= maxTags) || !maxTags) {
                onChange(data);
              }
            } else {
              onChange(data);
            }
          }}
          {...autocompleteProps}
          {...controllerProps}
        />
      )}
      defaultValue={defaultValue}
      rules={rules}
      name={name}
      control={control}
    />

    {getFormErrorHelperText(errors, name)}
  </Box>
);
