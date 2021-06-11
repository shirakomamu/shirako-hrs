import { Schema } from "express-validator";
import {
  UsernameParamSchema,
  DiscriminatorParamSchema,
  PasswordRegistrationParamSchema,
  EmailRegistrationParamSchema,
} from "./auth.param.validation";

export const RegisterNewMemberSchema: Schema = {
  username: UsernameParamSchema,
  discriminator: DiscriminatorParamSchema,
  password: PasswordRegistrationParamSchema,
  email: EmailRegistrationParamSchema,
};
