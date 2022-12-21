import { FormControl, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { get } from "lodash-es";

import { getFormErrorHelperText } from "common/utils/getFormErrorHelperText";
import { registerMui } from "common/utils/registerMui";

export interface SelectProps {
  name: string;
  label?: string;
  register: any;
  control: any;
  errors: FieldErrors;
  rules?: any;
  sx?: any;
}

export const FileInput = ({
  name,
  label,
  register,
  errors,
  rules,
  control,
  ...inputProps
}: SelectProps) => (
  <FormControl>
    <InputLabel id={`${name}-select-label`} error={get(errors, name)}>
      {label}
    </InputLabel>

    <input type="file" {...register(name, rules)} {...inputProps} />

    {getFormErrorHelperText(errors, name)}
  </FormControl>
);
