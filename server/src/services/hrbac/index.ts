import HRBAC from "src/classes/Hrbac";
import { Role, RoleGroup } from "./hrbac.enums";
import { HrbacOptions } from "./hrbac.types";

const opts = {
  [RoleGroup.owner]: {
    name: "Root",
    description: "Root permission.",
    roles: [],
    inherits: [RoleGroup.admin],
  },
  [RoleGroup.admin]: {
    name: "Administrator",
    description: "Super administrator.",
    roles: [Role._acl_roles_equal],
    inherits: [RoleGroup.acl_manager],
  },
  [RoleGroup.acl_manager]: {
    name: "ACL manager",
    description: "Manage application ACL.",
    roles: [],
    inherits: [RoleGroup.acl_members_manager, RoleGroup.acl_logs_viewer],
  },
  [RoleGroup.acl_members_manager]: {
    name: "ACL members manager",
    description: "Manage application members.",
    roles: [Role._acl_members_ALL, Role._acl_roles_lower],
  },
  [RoleGroup.acl_logs_viewer]: {
    name: "ACL logs viewer",
    description: "View system logs.",
    roles: [Role._acl_logs_view],
  },
  [RoleGroup.member]: {
    name: "Member",
    description: "Base member role.",
    roles: [Role._self_profile, Role._self_apis],
  },
} as HrbacOptions;

const hrbac = new HRBAC(opts);

export default hrbac;
export * from "src/services/hrbac/hrbac.enums";
export * from "src/services/hrbac/hrbac.types";
