import { Role } from "server/src/services/hrbac/hrbac.enums";
import { GuardBehavior } from "./guard.enums";

export type Guard = {
  roles?: Role[];
  guards?: Guard[];
  mode?: GuardBehavior; // defaults to "all"
};
