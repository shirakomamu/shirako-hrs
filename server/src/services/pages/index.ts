import * as types from "./pages.types";
import { enums as GuardEnums } from "src/services/guard";
import { enums as HrbacEnums } from "src/services/hrbac";

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
