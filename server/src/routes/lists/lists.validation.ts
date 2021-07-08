import { checkSchema } from "express-validator";
import {
  ListNameParamSchema,
  ListVisibilityParamSchema,
} from "./lists.param.validation";

export const CreateDestinationListValidators = [
  checkSchema({
    name: ListNameParamSchema,
    visibility: ListVisibilityParamSchema,
  }),
];
