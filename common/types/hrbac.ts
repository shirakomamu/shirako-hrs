import { GuardBehavior, Role } from "common/enums/hrbac";

export type Guard = {
  roles?: Role[];
  guards?: Guard[];
  mode?: GuardBehavior; // defaults to "all"
};
