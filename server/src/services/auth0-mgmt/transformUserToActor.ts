import { Auth0UserMetadataDto } from "common/dto/auth";
import { RoleGroup } from "common/enums/hrbac";
import { GetUserResponse } from "./getUser";

export default (userinfo: GetUserResponse) => {
  const appRgs = userinfo.app_metadata?.hrs.rgs || [];

  return {
    id: userinfo.user_id || "n/a",
    username: userinfo.username || "n/a",
    nickname: userinfo.nickname || "n/a",
    email: userinfo.email || "n/a",
    avatar:
      process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL ||
      userinfo.picture ||
      "",
    cohort: null,
    key: false,
    rgs: userinfo.email_verified
      ? [RoleGroup.member_verified, ...appRgs]
      : [RoleGroup.member, ...appRgs],
    meta: (userinfo.user_metadata as Auth0UserMetadataDto) || {},
  };
};
