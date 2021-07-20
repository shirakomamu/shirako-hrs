import { ParamSchema } from "express-validator";

export const SearchTermParamSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};

export const LocationParamSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};

export const YelpIdParamSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};
