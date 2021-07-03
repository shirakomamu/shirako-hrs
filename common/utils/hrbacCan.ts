import { NameCheckDto } from "../dto/auth";

// @ts-ignore
export default ({ actorRoles, roles }: NameCheckDto): boolean => {
  if (!roles.length) {
    // if no roles are checked, always true
    return true;
  }
  if (!actorRoles.length) {
    // if no rgs are present, always false
    return false;
  }
};
