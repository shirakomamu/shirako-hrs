import { FriendRequestPrivacy } from "common/enums";
import { UserIdentity } from "common/types/api";
import { GetUserResponse } from "server/services/auth0-mgmt/getUser";

// type MapperFunction = <B extends boolean = false>(
//   data: GetUserResponse,
//   includeId?: B
// ) => B extends true ? UserIdentity : Omit<UserIdentity, "id">;

export default (data: GetUserResponse): UserIdentity => {
  return {
    id: data.user_id || "n/a",
    username: data.username || "n/a",
    nickname: data.nickname || "n/a",
    avatar:
      process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL || data.picture || "",
    cohort: null,
    isAcceptingFriends:
      data.user_metadata?.privacySettings?.friendRequestPrivacy ===
      FriendRequestPrivacy.anyone,
  };
};
