import { GuardBehavior, Role } from "common/enums/hrbac";

export interface Guard {
  roles?: Role[];
  guards?: Guard[];
  mode?: GuardBehavior; // defaults to "all"
}
