import { FriendRequestPrivacy } from "common/enums";
import { UserIdentity } from "common/types/api";
import getUserCached from "server/services/auth0-mgmt/getUserCached";

export default async <T extends string>(
  userIds: T[]
): Promise<Partial<Record<T, UserIdentity>>> => {
  const uniqueUserIds = userIds.filter((e, i, a) => a.indexOf(e) === i);
  const uniqueUsers = await Promise.allSettled(
    uniqueUserIds.map((e) => getUserCached({ id: e }))
  );
  const usermap: Partial<Record<T, UserIdentity>> = {};

  // for (const id of uniqueUserIds) {
  //   usermap[id] = {
  //     username: "n/a",
  //     nickname: "n/a",
  //   };
  // }

  for (const result of uniqueUsers) {
    if (result.status === "fulfilled") {
      const userId = result.value.user_id as T;

      usermap[userId] = {
        id: userId,
        username: result.value.username || "n/a",
        nickname: result.value.nickname || "n/a",
        avatar:
          process.env.DEFAULT_PROFILE_PICTURE_OVERRIDE_URL ||
          result.value.picture ||
          "",
        cohort: null,
        isAcceptingFriends:
          result.value.user_metadata?.privacySettings?.friendRequestPrivacy ===
          FriendRequestPrivacy.anyone,
      };
    }
  }

  return usermap;
};
