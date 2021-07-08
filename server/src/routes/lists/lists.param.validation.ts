import { ListVisibility } from "common/enums";
import { ParamSchema } from "express-validator";

export const ListNameParamSchema: ParamSchema = {
  in: ["body"],
  isString: {
    errorMessage: "List name must be a string",
    bail: true,
  },
  trim: true,
  isLength: {
    errorMessage: "List name must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
};

export const ListVisibilityParamSchema: ParamSchema = {
  in: ["body"],
  custom: {
    errorMessage: "List visibility is invalid",
    options: (value: any) => {
      return Object.keys(ListVisibility).includes(value);
    },
  },
};
