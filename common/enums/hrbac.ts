export enum GuardBehavior {
  all,
  some,
  notAll,
  notSome,
}

export enum Role {
  "_beta_g1" = "_beta_g1",

  // user
  "_self_profile" = "_self_profile",
  "_self_friends" = "_self_friends",
  "_self_destination_lists" = "_self_destination_lists",

  // utility
  "_email_verified" = "_email_verified",
}

export enum RoleGroup {
  // beta flags
  "beta_g1" = "beta_g1",

  // user
  "member_verified" = "member_verified",
  "member" = "member",
}
