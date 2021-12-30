import { useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete, TextField } from "@mui/material";

export const Autocomplete = ({
  control,
  options,
  label,
  defaultValue,
  maxTags,
  name,
  ...autocompleteProps
}) => {
  const [value, setValue] = useState([]);

  return (
    <Controller
      render={({ field: { onChange, ...controllerProps } }) => (
        <MuiAutocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label={label} />}
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
