import { ParamSchema } from "express-validator";

export const NeuronsListParamSchema: ParamSchema = {
  isArray: {
    options: {
      min: 1,
      max: 10,
    },
  },
};

export const NeuronParamSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 1,
      max: 64,
    },
  },
};
