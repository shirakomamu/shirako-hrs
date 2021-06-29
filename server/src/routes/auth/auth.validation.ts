import { checkSchema, oneOf } from "express-validator";
import {
  UsernameParamSchema,
  NicknameParamSchema,
  EmailParamSchema,
  FriendRequestPrivacyParamSchema,
  DefaultListVisibilityParamSchema,
} from "./auth.param.validation";

// additional check is done in method for _email_verified role if username or displayName
export const UpdateUserValidators = [
  oneOf([
    checkSchema({
      username: UsernameParamSchema,
    }),
    checkSchema({
      nickname: NicknameParamSchema,
    }),
    checkSchema({
      email: EmailParamSchema,
    }),
  ]),
];

export const UpdateUserPreferencesValidators = [
  oneOf([
    checkSchema({
      friendRequestPrivacy: FriendRequestPrivacyParamSchema,
    }),
    checkSchema({
      defaultListVisibility: DefaultListVisibilityParamSchema,
    }),
  ]),
];

// export const OtpTokenValidators = [
//   checkSchema({
//     otpToken: OtpTokenCheckParamSchema,
//     otpCode: OtpCodeCheckParamSchema,
//   }),
// ];

// export const NameCheckValidators = [
//   oneOf([
//     checkSchema({
//       type: NameCheckTypeIsUsernameParamSchema,
//       name: UsernameParamSchema,
//     }),
//     checkSchema({
//       type: NameCheckTypeIsDisplayNameParamSchema,
//       name: DisplayNameParamSchema,
//     }),
//   ]),
// ];

// export const PageAuthValidators = [
//   body().isArray(),
//   checkSchema({
//     "*": PageCheckElementParamSchema,
//   }),
//   body().customSanitizer((value: string[]) =>
//     value.filter((e, i, a) => a.indexOf(e) === i)
//   ),
// ];
