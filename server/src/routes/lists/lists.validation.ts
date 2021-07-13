import { checkSchema } from "express-validator";
import {
  DestinationListIdParamSchema,
  ListNameParamSchema,
  ListVisibilityParamSchema,
  SelfUsernameParamSchema,
  UsernameParamSchema,
} from "./lists.param.validation";

export const CreateDestinationListValidators = [
  checkSchema({
    username: SelfUsernameParamSchema,
    name: ListNameParamSchema,
    visibility: ListVisibilityParamSchema,
  }),
];

export const GetDestinationListValidators = [
  checkSchema({
    username: UsernameParamSchema,
    id: DestinationListIdParamSchema,
  }),
];
export const GetDestinationListsByUsernameValidators = [
  checkSchema({
    username: UsernameParamSchema,
  }),
];
