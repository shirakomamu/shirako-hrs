import { GuardBehavior } from "./guard.enums";
import { Role } from "src/services/hrbac/hrbac.enums";

export type Guard = {
  roles?: Role[];
  guards?: Guard[];
  mode?: GuardBehavior; // defaults to "all"
};
