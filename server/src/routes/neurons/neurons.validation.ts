import { checkSchema } from "express-validator";
import {
  NeuronParamSchema,
  NeuronsListParamSchema,
} from "./neurons.param.validation";

export const ActivateNeuronsValidators = [
  ...checkSchema({
    neurons: {
      in: ["body"],
      ...NeuronsListParamSchema,
    },
    "neurons.*": {
      in: ["body"],
      ...NeuronParamSchema,
    },
  }),
];
