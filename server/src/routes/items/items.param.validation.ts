import { ParamSchema } from "express-validator";

export const SearchTermParamSchema: ParamSchema = {
  in: ["body"],
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};

export const LocationParamSchema: ParamSchema = {
  in: ["body"],
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};

export const YelpIdParamSchema: ParamSchema = {
  in: ["params"],
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};
