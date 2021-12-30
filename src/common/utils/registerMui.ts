import { get } from "lodash-es";

import { FORM_ERRORS } from "common/config/formErrors";

export const registerMui = ({ register, name, props, errors }) => ({
  ...register(name, props),
  ...(get(errors, name)
    ? {
        error: true,
        helperText: FORM_ERRORS[get(errors, `${name}.type`)],
      }
    : {}),
});
