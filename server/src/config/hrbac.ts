import { Role, RoleGroup } from "@@/common/enums/hrbac";
import { HrbacOptions } from "src/services/hrbac-rules";

const options = {
  [RoleGroup.member_verified]: {
    name: "Member",
    description: "Verified member.",
    roles: [
      Role._email_verified,
      Role._self_destination_lists,
      Role._self_friends,
    ],
    inherits: [RoleGroup.member],
  },
  [RoleGroup.member]: {
    name: "Member (unverified)",
    description: "Unverified member.",
    roles: [Role._self_profile],
  },
  [RoleGroup.beta_g1]: {
    name: "Beta (G1)",
    description: "Access to G1 beta features.",
    roles: [Role._beta_g1],
  },
} as HrbacOptions;

export default options;
