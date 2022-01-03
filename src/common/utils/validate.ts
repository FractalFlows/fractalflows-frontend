export const validateURL = (url: string) =>
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
    url
  );

export const validateURLWithHostname = (url: string, hostname: string) =>
  validateURL(url) && url.includes(hostname);

export const validateDOI = (doi: string) =>
  new RegExp('(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![%"#? ])\\S)+)').test(doi);

export const validateEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const validateTwitterHandle = (handle: string) =>
  /^@(?=.*\w)[\w]{1,15}$/.test(handle);

export const validateCustomUsernameCharacters = (customUsername: string) =>
  /^(?=.*\w)[\w\.]*$/.test(customUsername);

export const validateCustomUsernameMinLength = (customUsername: string) =>
  customUsername.length >= 4;

export const validateCustomUsernameMaxLength = (customUsername: string) =>
  customUsername.length <= 15;
