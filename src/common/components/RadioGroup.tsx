import {
  RadioGroup as MuiRadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { get } from "lodash-es";

import { getFormErrorHelperText } from "common/utils/getFormErrorHelperText";

export interface RadioGroupOptionsProps {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  control: any;
  options: RadioGroupOptionsProps[];
  errors: FieldErrors;
  rules?: any;
  sx?: any;
}

export const RadioGroup = ({
  name,
  label,
  errors,
  options,
  rules,
  control,
  ...radioGroupProps
}: RadioGroupProps) => (
  <FormControl>
    {label ? <FormLabel error={get(errors, name)}>{label}</FormLabel> : null}

    <Controller
      render={({ field: controllerProps }) => (
        <MuiRadioGroup {...radioGroupProps} {...controllerProps}>
          {options.map((option) => (
            <FormControlLabel
              value={option.value}
              label={option.label}
              disabled={option.disabled}
              control={<Radio />}
              key={option.value}
            />
          ))}
        </MuiRadioGroup>
      )}
      name={name}
      control={control}
      rules={rules}
    />

    {getFormErrorHelperText(errors, name)}
  </FormControl>
);
