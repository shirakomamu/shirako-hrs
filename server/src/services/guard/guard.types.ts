import { Role } from "src/services/hrbac";
import { GuardBehavior } from "./guard.enums";

export type Guard = {
  roles?: Role[];
  guards?: Guard[];
  mode?: GuardBehavior; // defaults to "all"
};
