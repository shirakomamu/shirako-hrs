import { ParamSchema } from "express-validator";

export const UsernameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Username must be a string",
  },
  trim: true,
  isLength: {
    errorMessage: "Username must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
  isAlphanumeric: {
    errorMessage: "Username must consist of letters and numbers",
  },
};

export const NicknameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Nickname must be a string",
  },
  trim: true,
  isLength: {
    errorMessage: "Nickname must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
};

export const EmailParamSchema: ParamSchema = {
  in: ["body"],
  isEmail: {
    errorMessage: "Email address is not valid",
  },
};
