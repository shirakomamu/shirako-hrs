import createZxcvbnDictForRegistration from "@@/common/utils/createZxcvbnDictForRegistration";
import { ParamSchema } from "express-validator";
import { NUM_AVAILABLE_DISCRIMINATORS } from "src/config/discriminator";
import { NUM_TOKEN_DIGITS } from "src/config/memberVerification";
import zxcvbn from "zxcvbn";

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

export const DisplayNameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Display name must be a string",
  },
  trim: true,
  isLength: {
    errorMessage: "Display name must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
};

export const NameCheckTypeIsUsernameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Name type must be a string",
    bail: true,
  },
  trim: true,
  custom: {
    errorMessage: "Invalid name type",
    options: (value: string) => {
      return value === "un";
    },
  },
};

export const NameCheckTypeIsDisplayNameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Name type must be a string",
    bail: true,
  },
  trim: true,
  custom: {
    errorMessage: "Invalid name type",
    options: (value: string) => {
      return value === "dn";
    },
  },
};

export const DiscriminatorParamSchema: ParamSchema = {
  in: ["body"],
  optional: true,
  toInt: true,
  isInt: {
    errorMessage: `Discriminator must be an integer 0 ~ ${
      NUM_AVAILABLE_DISCRIMINATORS - 1
    }`,
    options: {
      min: 0,
      max: NUM_AVAILABLE_DISCRIMINATORS - 1,
    },
  },
};

export const PasswordRegistrationParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Password must be a string",
  },
  custom: {
    errorMessage: "Password is too weak",
    options: (value: string, { req }) => {
      const dictObj: {
        username?: string;
        email?: string;
        displayName?: string;
      } = {};

      if (req?.body) {
        if (req.body?.username) dictObj.username = req.body.username;
        if (req.body?.email) dictObj.email = req.body.email;
        if (req.body?.displayName) dictObj.displayName = req.body.displayName;
      }

      const dict = createZxcvbnDictForRegistration(dictObj);

      const result = zxcvbn(value, dict);

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
  isEmail: {
    errorMessage: "Email address is not valid",
  },
};

export const OtpTokenCheckParamSchema: ParamSchema = {
  in: ["body"],
  isUUID: {
    errorMessage: "OTP token is not valid",
  },
};

export const OtpCodeCheckParamSchema: ParamSchema = {
  in: ["body"],
  optional: true,
  isString: {
    errorMessage: "OTP code is not valid",
  },
  isLength: {
    errorMessage: "OTP code is not the correct length",
    options: {
      min: NUM_TOKEN_DIGITS,
      max: NUM_TOKEN_DIGITS,
    },
  },
  isNumeric: {
    errorMessage: "OTP code is not valid",
  },
};

// replace trailing slash
export const PageCheckElementParamSchema: ParamSchema = {
  in: ["body"],
  isString: { errorMessage: "Page must be a string", bail: true },
  customSanitizer: {
    options: (value: string) => {
      return value.replace(/\/$/, "");
    },
  },
};
