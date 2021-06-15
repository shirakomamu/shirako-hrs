import { checkSchema, body } from "express-validator";
import {
  UsernameParamSchema,
  DisplayNameParamSchema,
  EmailRegistrationParamSchema,
  PasswordRegistrationParamSchema,
  PageCheckElementParamSchema,
} from "./auth.param.validation";

export const RegisterNewMemberValidators = [
  checkSchema({
    username: UsernameParamSchema,
    displayName: DisplayNameParamSchema,
    email: EmailRegistrationParamSchema,
    password: PasswordRegistrationParamSchema,
  }),
];

export const PageAuthValidators = [
  body().isArray(),
  checkSchema({
    "*": PageCheckElementParamSchema,
  }),
  body().customSanitizer((value: string[]) =>
    value.filter((e, i, a) => a.indexOf(e) === i)
  ),
];
