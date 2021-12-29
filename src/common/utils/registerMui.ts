const FORM_ERRORS = {
  required: "This field is required",
};

export const registerMui = ({ register, name, props, errors }) => ({
  ...register(name, props),
  ...(errors[name]
    ? {
        error: true,
        helperText: FORM_ERRORS[errors[name].type],
      }
    : {}),
});
