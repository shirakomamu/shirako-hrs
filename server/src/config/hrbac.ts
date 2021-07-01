import { HrbacOptions } from "src/services/hrbac/hrbac.types";
import { Role, RoleGroup } from "src/services/hrbac/hrbac.enums";

const options = {
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
  [RoleGroup.member_verified]: {
    name: "Member",
    description: "Base member role.",
    roles: [Role._email_verified, Role._self_apis],
    inherits: [RoleGroup.member],
  },
  [RoleGroup.member]: {
    name: "Member (unverified)",
    description: "Unverified member role.",
    roles: [Role._self_profile],
  },
} as HrbacOptions;

export default options;
