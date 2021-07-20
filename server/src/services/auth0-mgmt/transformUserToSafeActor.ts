import { Auth0UserMetadataDto } from "common/dto/auth";
import { FriendRequestPrivacy } from "common/enums";
import { GetUserResponse } from "./getUser";

export default (userinfo: GetUserResponse) => {
  const metadata = userinfo.user_metadata as Auth0UserMetadataDto;

  return {
    id: userinfo.user_id || "N/A",
    username: userinfo.username || "N/A",
    nickname: userinfo.nickname || "N/A",
    avatar:
      process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL ||
      userinfo.picture ||
      "",
    cohort: null,
    isAcceptingFriends:
      metadata.privacySettings?.friendRequestPrivacy ===
      FriendRequestPrivacy.anyone,
  };
};
