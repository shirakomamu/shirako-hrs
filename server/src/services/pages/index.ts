import { enums as GuardEnums } from "server/src/services/guard";
import { enums as HrbacEnums } from "server/src/services/hrbac";
import * as types from "./pages.types";

const pageMap: types.PageMap = {
  "/": {},
  "/profile": {
    roles: [HrbacEnums.Role._self_profile],
    guards: [],
    mode: GuardEnums.GuardBehavior.all,
  },
};

export default pageMap;
export { types };
