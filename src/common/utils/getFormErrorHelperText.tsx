import { get } from "lodash-es";
import { FormHelperText } from "@mui/material";

import { FORM_ERRORS } from "common/config/formErrors";

export const getFormErrorHelperText = (errors, name: string) => {
  const error = get(errors, `${name}.type`);
  return error ? (
    <FormHelperText error>{FORM_ERRORS[error]}</FormHelperText>
  ) : null;
};
