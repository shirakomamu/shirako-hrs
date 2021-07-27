import { ParamSchema } from "express-validator";
import { UsernameParamSchema as UsernameParamSchemaFromLists } from "server/routes/lists/lists.param.validation";

// import { ParamSchema } from "express-validator";
export const UsernameParamSchema: ParamSchema = {
  ...UsernameParamSchemaFromLists,
};
