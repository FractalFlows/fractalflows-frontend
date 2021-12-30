import { get } from "lodash-es";
import { FormHelperText } from "@mui/material";
import type { FieldErrors } from "react-hook-form";

import { FORM_ERRORS } from "common/config/formErrors";

export const getFormErrorHelperText = (errors: FieldErrors, name: string) => {
  const error = get(errors, `${name}.type`);

  return error ? (
    <FormHelperText error>{get(FORM_ERRORS, error)}</FormHelperText>
  ) : null;
};
