import { checkSchema } from "express-validator";
import {
  LocationParamSchema,
  SearchTermParamSchema,
  YelpIdParamSchema,
} from "./items.param.validation";

export const DestinationItemSearchValidators = [
  ...checkSchema({
    term: SearchTermParamSchema,
    location: LocationParamSchema,
  }),
];

export const DestinationItemIdentifyValidators = [
  ...checkSchema({
    id: YelpIdParamSchema,
  }),
];
