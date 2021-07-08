import { Role, RoleGroup } from "common/enums/hrbac";
import options from "server/config/hrbac";

export type HrbacOptions = {
  [key in keyof RoleGroup as string]: {
    name: string;
    description?: string;
    roles: Role[];
    inherits?: RoleGroup[];
  };
};

type ResolvedRbacOptions = {
  [key in keyof RoleGroup as string]: Role[];
};

function initializeOptions(ro: HrbacOptions): ResolvedRbacOptions {
  const rgs: ResolvedRbacOptions = {};
  for (const rg in ro) {
    const rga = [rg, ...getAllChildren(rg as RoleGroup, ro)];
    const resolvedRoles = resolveRoleGroups(rga as RoleGroup[], ro);
    rgs[rg] = resolvedRoles;
  }

  return rgs;
}

function resolveRoleGroups(rga: RoleGroup[], ro: HrbacOptions): Role[] {
  return rga
    .flatMap((e) => ro[e].roles)
    .filter((e, i, a) => a.indexOf(e) === i);
}

function getChildren(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
  return ro[rg].inherits || [];
}

function getChildrenWithSelf(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
  return [
    rg,
    ...getChildren(rg, ro).flatMap((e) => getChildrenWithSelf(e, ro)),
  ];
}

function getAllChildren(rg: RoleGroup, ro: HrbacOptions): RoleGroup[] {
  return getChildren(rg, ro)
    .flatMap((e) => getChildrenWithSelf(e, ro))
    .filter((e, i, a) => a.indexOf(e) === i);
}

export default initializeOptions(options);
