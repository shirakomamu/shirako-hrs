import { Schema } from "express-validator";
import {
  EmailRegistrationParamSchema,
  PasswordRegistrationParamSchema,
  UsernameParamSchema,
} from "./auth.param.validation";

export const RegisterNewMemberSchema: Schema = {
  username: UsernameParamSchema,
  password: PasswordRegistrationParamSchema,
  email: EmailRegistrationParamSchema,
};
