export enum Role {
  // administrative
  "_owner" = "_owner",
  "_admin" = "_admin",

  // system
  "_acl_members_ALL" = "_acl_members_*",
  "_acl_members_view" = "_acl_members_view",
  "_acl_members_add" = "_acl_members_add",
  "_acl_members_edit" = "_acl_members_edit",
  "_acl_members_delete" = "_acl_members_delete",
  "_acl_roles_lower" = "_acl_roles_lower",
  "_acl_roles_equal" = "_acl_roles_equal",
  "_acl_logs_view" = "_acl_logs_view",

  // user
  "_self_profile" = "_self_profile",
  "_self_apis" = "_self_apis",

  "_email_verified" = "_email_verified",
}

export enum RoleGroup {
  // administrative
  "owner" = "owner",
  "admin" = "admin",

  // system
  "acl_manager" = "acl_manager",
  "acl_members_manager" = "acl_members_manager",
  "acl_logs_viewer" = "acl_logs_viewer",

  // user
  "member_verified" = "member_verified",
  "member" = "member",
}
