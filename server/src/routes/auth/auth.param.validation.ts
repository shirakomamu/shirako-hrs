import { ParamSchema } from "express-validator";
import zxcvbn from "zxcvbn";

export const UsernameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Username must be a string",
  },
  trim: true,
  isLength: {
    errorMessage: "Username must be 1~24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
  isAlphanumeric: {
    errorMessage: "Username must consist of letters and numbers",
  },
};

export const PasswordRegistrationParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Password must be a string",
  },
  custom: {
    errorMessage: "Password is too weak",
    options: (value: string) => {
      const result = zxcvbn(value);

      if (result.score <= 2) {
        if (result.feedback.warning) {
          throw new Error(result.feedback.warning);
        }
        if (result.feedback.suggestions.length) {
          throw new Error(result.feedback.suggestions.join(" "));
        }
      }

      return result.score >= 3;
    },
  },
};

export const EmailRegistrationParamSchema: ParamSchema = {
  in: ["body"],
  optional: {
    options: {
      nullable: true,
    },
  },
  isEmail: {
    errorMessage: "Email address is not valid",
  },
};
