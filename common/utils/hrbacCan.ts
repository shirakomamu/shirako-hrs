import { Guard } from "common/types/hrbac";
import { GuardBehavior, Role } from "common/enums/hrbac";
import Actor from "server/classes/Actor";
import memoizee from "memoizee";

const DEFAULT_CHECK_BEHAVIOR = GuardBehavior.all;

type Check = {
  actorRoles: Role[];
  roles: Role[];

  // all = all roles must be accessible, by any of the rgs
  // any = any of the roles can be accessible, by any of the rgs
  mode: GuardBehavior;
};

function validate(actorRoles: Role[], role: Role): boolean {
  return actorRoles.includes(role);
}

function check({ actorRoles, roles, mode }: Check): boolean {
  if (!roles.length) {
    // if no roles are checked, always true
    return true;
  }
  if (!actorRoles.length) {
    // if no rgs are present, always false
    return false;
  }

  const validationResults = roles.map((e) => validate(actorRoles, e));

  switch (mode) {
    case GuardBehavior.all:
      return validationResults.every((e) => e);
    case GuardBehavior.some:
      return validationResults.some((e) => e);
    case GuardBehavior.notAll:
      return !validationResults.every((e) => e);
    case GuardBehavior.notSome:
      return !validationResults.some((e) => e);
    default:
      return false;
  }
}

const memoizedCheck = memoizee(check, {
  length: 1,
  primitive: true,
  normalizer: (args) => JSON.stringify(args[0]),
});

function can(guard: Guard, actor?: Actor | null): boolean {
  const canArgs = {
    actorRoles: actor?.roles || [],
    roles: guard.roles || [],
    mode: guard.mode || DEFAULT_CHECK_BEHAVIOR,
  };

  const roleResult = memoizedCheck(canArgs);

  // if simple roles checking fails, immediately return
  if (!roleResult) {
    return false;
  }

  // if it's true and there's no guards, then immediately true
  if (!guard.guards || !guard.guards.length) {
    return true;
  }

  // else, try to resolve the guards
  let guardResult = false;
  if (guard.mode === GuardBehavior.all) {
    guardResult = guard.guards.every((e) => can(e, actor));
  } else {
    guardResult = guard.guards.some((e) => can(e, actor));
  }

  return guardResult;
}

const hrbacCan = memoizee(can, {
  length: 2,
  primitive: true,
  normalizer: (args) => JSON.stringify(args),
});

export default hrbacCan;
