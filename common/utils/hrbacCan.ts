import { GuardBehavior } from "src/services/guard";
import { NameCheckDto } from "../dto/auth";

// @ts-ignore
export default ({ actorRoles, roles, mode }: NameCheckDto): boolean => {
  if (!roles.length) {
    // if no roles are checked, always true
    return true;
  }
  if (!actorRoles.length) {
    // if no rgs are present, always false
    return false;
  }

  const validationResults = roles.map((e) => this._validate(actorRoles, e));

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
};
