import { FriendRequestPrivacy } from "common/enums";
import { UserIdentity } from "common/types/api";
import getUserCached from "server/services/auth0-mgmt/getUserCached";

export default async <T extends string>(
  usernames: T[]
): Promise<Partial<Record<T, UserIdentity>>> => {
  const uniqueUsernames = usernames.filter((e, i, a) => a.indexOf(e) === i);
  const uniqueUsers = await Promise.allSettled(
    uniqueUsernames.map((e) => getUserCached({ username: e }))
  );
  const usermap: Partial<Record<T, UserIdentity>> = {};

  // for (const id of uniqueUsernames) {
  //   usermap[id] = {
  //     username: "n/a",
  //     nickname: "n/a",
  //   };
  // }

  for (const result of uniqueUsers) {
    if (result.status === "fulfilled") {
      const username = result.value.username as T;

      usermap[username] = {
        id: result.value.user_id || "n/a",
        username,
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
