import { Auth0UserMetadataDto } from "common/dto/auth";
import { RoleGroup } from "common/enums/hrbac";
import { GetUserResponse } from "./getUser";

export default (userinfo: GetUserResponse) => {
  const roles =
    (userinfo.app_metadata as { [key: string]: any })?.hrs?.rgs || [];

  return {
    id: userinfo.user_id || "N/A",
    username: userinfo.username || "N/A",
    nickname: userinfo.nickname || "N/A",
    email: userinfo.email || "N/A",
    avatar:
      process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL ||
      userinfo.picture ||
      "",
    cohort: null,
    key: null,
    rgs: userinfo.email_verified
      ? [RoleGroup.member_verified, ...roles]
      : [RoleGroup.member, ...roles],
    meta: (userinfo.user_metadata as Auth0UserMetadataDto) || {},
  };
};
