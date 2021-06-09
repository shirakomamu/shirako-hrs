import { GuardBehavior } from "src/services/guard";
import { Role } from "src/services/hrbac";
import { PageMap } from "./pages.types";

const pageMap: PageMap = {
  "/": {},
  "/profile": {
    roles: [Role._self_profile],
    guards: [],
    mode: GuardBehavior.all,
  },
};

export default pageMap;
export * from "./pages.types";
