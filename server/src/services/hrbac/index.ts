import HRBAC from "server/src/classes/Hrbac";
import * as enums from "server/src/services/hrbac/hrbac.enums";
import * as types from "server/src/services/hrbac/hrbac.types";

const opts = {
  [enums.RoleGroup.owner]: {
    name: "Root",
    description: "Root permission.",
    roles: [],
    inherits: [enums.RoleGroup.admin],
  },
  [enums.RoleGroup.admin]: {
    name: "Administrator",
    description: "Super administrator.",
    roles: [enums.Role._acl_roles_equal],
    inherits: [enums.RoleGroup.acl_manager],
  },
  [enums.RoleGroup.acl_manager]: {
    name: "ACL manager",
    description: "Manage application ACL.",
    roles: [],
    inherits: [
      enums.RoleGroup.acl_members_manager,
      enums.RoleGroup.acl_logs_viewer,
    ],
  },
  [enums.RoleGroup.acl_members_manager]: {
    name: "ACL members manager",
    description: "Manage application members.",
    roles: [enums.Role._acl_members_ALL, enums.Role._acl_roles_lower],
  },
  [enums.RoleGroup.acl_logs_viewer]: {
    name: "ACL logs viewer",
    description: "View system logs.",
    roles: [enums.Role._acl_logs_view],
  },
  [enums.RoleGroup.member]: {
    name: "Member",
    description: "Base member enums.role.",
    roles: [enums.Role._self_profile, enums.Role._self_apis],
  },
} as types.HrbacOptions;

const hrbac = new HRBAC(opts);

export default hrbac;
export { types, enums };
