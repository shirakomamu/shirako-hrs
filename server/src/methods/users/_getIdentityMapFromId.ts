import { UserIdentity } from "common/types/api";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import _mapAuth0ToIdentity from "./_mapAuth0ToIdentity";

export default async <T extends string = string>(
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

      usermap[userId] = _mapAuth0ToIdentity(result.value);
    }
  }

  return usermap;
};
