import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";

export interface CheckboxProps {
  name: string;
  label?: string;
  control: any;
}

export const Checkbox = ({
  name,
  label = "",
  control,
  ...checkboxProps
}: CheckboxProps) => (
  <FormControlLabel
    control={
      <Controller
        render={({ field: controllerProps }) => (
          <MuiCheckbox
            {...checkboxProps}
            {...controllerProps}
            checked={controllerProps.value}
          />
        )}
        name={name}
        control={control}
      />
    }
    label={label}
  />
);
