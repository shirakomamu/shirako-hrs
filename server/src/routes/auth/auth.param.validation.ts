import { ParamSchema } from "express-validator";
import { ListVisibility, FriendRequestPrivacy } from "common/enums";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";

const protectedUsernames = [/^me$/i, /.{0,}mamu.{0,}/i, /.{0,}shirako.{0,}/i];
export const UsernameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "Username must be a string",
    bail: true,
  },
  trim: true,
  isLength: {
    errorMessage: "Username must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
  toLowerCase: true,
  custom: {
    errorMessage:
      "Username is limited to alphanumeric characters and the symbols [@, ^, $, ., !, `, -, #, +, ', ~, _], or you cannot use this username",
    options: (value: string, { req }) => {
      const actor = req.locals?.authResult?.actor;

      const tests: boolean[] = [];
      // https://auth0.com/docs/connections/database/require-username
      tests.push(/^[A-z0-9@^$.!`\-#+'~_]+$/.test(value));

      if (!hrbacCan({ roles: [Role._protected_usernames] }, actor)) {
        tests.push(!protectedUsernames.some((e) => e.test(value)));
      }

      return tests.every((e) => e);
    },
  },
  isEmail: {
    errorMessage: "Username cannot be an email address",
    negated: true,
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

export const FriendRequestPrivacyParamSchema: ParamSchema = {
  in: ["body"],
  custom: {
    errorMessage: "Option is invalid",
    options: (value: any) => {
      return Object.values(FriendRequestPrivacy).includes(value);
    },
  },
};

export const DefaultListVisibilityParamSchema: ParamSchema = {
  in: ["body"],
  custom: {
    errorMessage: "Option is invalid",
    options: (value: any) => {
      return Object.values(ListVisibility).includes(value);
    },
  },
};
