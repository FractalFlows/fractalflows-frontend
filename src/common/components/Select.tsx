import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { get } from "lodash-es";

import { getFormErrorHelperText } from "common/utils/getFormErrorHelperText";

export interface SelectOptionProps {
  label: string;
  value: string;
}

export interface SelectProps {
  name: string;
  label: string;
  control: any;
  options: SelectOptionProps[];
  errors: FieldErrors;
  rules?: any;
  fullWidth?: boolean;
  sx?: any;
}

export const Select = ({
  name,
  label,
  errors,
  options,
  rules,
  control,
  ...selectProps
}: SelectProps) => (
  <FormControl>
    <InputLabel id={`${name}-select-label`} error={get(errors, name)}>
      {label}
    </InputLabel>

    <Controller
      render={({ field: controllerProps }) => (
        <MuiSelect
          labelId={`${name}-select-label`}
          label={label}
          fullWidth
          sx={{ width: { xs: "unset", sm: 150 } }}
          error={!!get(errors, name)}
          {...selectProps}
          {...controllerProps}
        >
          {options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
      )}
      name={name}
      control={control}
      rules={rules}
    />

    {getFormErrorHelperText(errors, name)}
  </FormControl>
);
