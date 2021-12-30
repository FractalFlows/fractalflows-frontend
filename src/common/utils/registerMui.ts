import { get } from "lodash-es";
import type {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

import { FORM_ERRORS } from "common/config/formErrors";

export interface RegisterMuiProps {
  register: UseFormRegister<any>;
  name: string;
  props: RegisterOptions;
  errors: FieldErrors;
}

export const registerMui = ({
  register,
  name,
  props,
  errors,
}: RegisterMuiProps) => ({
  ...register(name, props),
  ...(get(errors, name)
    ? {
        error: true,
        helperText: get(FORM_ERRORS, get(errors, `${name}.type`)),
      }
    : {}),
});
