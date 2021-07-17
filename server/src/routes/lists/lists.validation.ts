import { checkSchema } from "express-validator";
import { YelpIdParamSchema } from "../items/items.param.validation";
import {
  DestinationListIdParamSchema,
  ListNameParamSchema,
  ListVisibilityParamSchema,
  SelfUsernameParamSchema,
  UsernameParamSchema,
} from "./lists.param.validation";

export const CreateDestinationListValidators = [
  ...checkSchema({
    username: SelfUsernameParamSchema,
    name: ListNameParamSchema,
    visibility: ListVisibilityParamSchema,
  }),
];

export const GetDestinationListValidators = [
  ...checkSchema({
    username: UsernameParamSchema,
    id: DestinationListIdParamSchema,
  }),
];

export const AddItemToDestinationListValidators = [
  ...checkSchema({
    username: SelfUsernameParamSchema,
    id: DestinationListIdParamSchema,
    destinationId: YelpIdParamSchema,
  }),
];

export const RemoveItemFromDestinationListValidators = [
  ...checkSchema({
    username: SelfUsernameParamSchema,
    id: DestinationListIdParamSchema,
    destinationId: YelpIdParamSchema,
  }),
];
