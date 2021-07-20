import { checkSchema, oneOf } from "express-validator";
import {
  UsernameParamSchema,
  NicknameParamSchema,
  EmailParamSchema,
  FriendRequestPrivacyParamSchema,
  DefaultListVisibilityParamSchema,
  DefaultLocationParamSchema,
} from "./auth.param.validation";

// additional check is done in method for _email_verified role if username or displayName
export const UpdateUserValidators = [
  oneOf([
    checkSchema({
      username: {
        in: ["body"],
        ...UsernameParamSchema,
      },
    }),
    checkSchema({
      nickname: {
        in: ["body"],
        ...NicknameParamSchema,
      },
    }),
    checkSchema({
      email: {
        in: ["body"],
        ...EmailParamSchema,
      },
    }),
  ]),
];

export const UpdateUserPreferencesValidators = [
  oneOf([
    checkSchema({
      "privacySettings.friendRequestPrivacy": {
        in: ["body"],
        ...FriendRequestPrivacyParamSchema,
      },
    }),
    checkSchema({
      "privacySettings.defaultListVisibility": {
        in: ["body"],
        ...DefaultListVisibilityParamSchema,
      },
    }),
    checkSchema({
      "locationSettings.defaultLocation": {
        in: ["body"],
        ...DefaultLocationParamSchema,
      },
    }),
  ]),
];
