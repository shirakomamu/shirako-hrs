// import { checkSchema } from "express-validator";

import { checkSchema } from "express-validator";
import { UsernameParamSchema } from "./users.param.validation";

export const GetMemberValidators = [
  ...checkSchema({
    username: {
      in: ["params"],
      ...UsernameParamSchema,
    },
  }),
];

export const CreateFriendValidators = [
  ...checkSchema({
    username: {
      in: ["body"],
      ...UsernameParamSchema,
    },
  }),
];

export const DeleteFriendValidators = [
  ...checkSchema({
    username: {
      in: ["body"],
      ...UsernameParamSchema,
    },
  }),
];
