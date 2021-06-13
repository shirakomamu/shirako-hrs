import { PageMap } from "src/services/pages";
import { GuardBehavior } from "src/services/guard";
import { Role } from "src/services/hrbac";

// no trailing slashes
export const PAGE_MAP = {
  "": {},
  "/profile": {
    roles: [Role._self_profile],
    guards: [],
    mode: GuardBehavior.all,
  },
} as PageMap;
