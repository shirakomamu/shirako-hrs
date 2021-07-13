import { ListVisibility } from "common/enums";
import { ParamSchema } from "express-validator";
import { SrkExpressRequest } from "server/services/jwt";
import snowflake from "server/services/snowflake";

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

export const UsernameParamSchema: ParamSchema = {
  in: ["params"],
  isString: {
    errorMessage: "Username must be a string",
    bail: true,
  },
  trim: true,
  isLength: {
    errorMessage: "Username must be 1 to 24 characters long",
    options: {
      min: 1,
      max: 24,
    },
  },
};

export const SelfUsernameParamSchema: ParamSchema = {
  ...UsernameParamSchema,
  custom: {
    errorMessage: "Unauthorized user",
    options: (value: string, { req }) => {
      const actor = (req as SrkExpressRequest).locals.authResult.actor;

      return actor?.username === value;
    },
  },
};

export const DestinationListIdParamSchema: ParamSchema = {
  in: ["params"],
  custom: {
    errorMessage: "Destination list ID is invalid",
    options: (value: any) => {
      snowflake.deconstruct(value);

      return true;
    },
  },
};
