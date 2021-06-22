// import { checkSchema, body, oneOf } from "express-validator";
// import {} from "./auth.param.validation";

// export const RegisterNewMemberValidators = [
//   checkSchema({
//     username: UsernameParamSchema,
//     displayName: DisplayNameParamSchema,
//     email: EmailRegistrationParamSchema,
//     password: PasswordRegistrationParamSchema,
//   }),
// ];

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
