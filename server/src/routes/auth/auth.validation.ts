import { checkSchema, body } from "express-validator";
import {
  UsernameParamSchema,
  DiscriminatorParamSchema,
  PasswordRegistrationParamSchema,
  EmailRegistrationParamSchema,
  PageCheckElementParamSchema,
} from "./auth.param.validation";

export const RegisterNewMemberValidators = [
  checkSchema({
    username: UsernameParamSchema,
    discriminator: DiscriminatorParamSchema,
    password: PasswordRegistrationParamSchema,
    email: EmailRegistrationParamSchema,
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
