import { checkSchema } from "express-validator";
import {
  LocationParamSchema,
  SearchTermParamSchema,
  YelpIdParamSchema,
} from "./items.param.validation";

export const DestinationItemSearchValidators = [
  ...checkSchema({
    term: {
      in: ["body"],
      ...SearchTermParamSchema,
    },
    location: {
      in: ["body"],
      ...LocationParamSchema,
    },
  }),
];

export const DestinationItemIdentifyValidators = [
  ...checkSchema({
    id: {
      in: ["params"],
      ...YelpIdParamSchema,
    },
  }),
];
