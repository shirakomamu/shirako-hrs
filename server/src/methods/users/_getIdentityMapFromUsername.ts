import { UserIdentity } from "common/types/api";
import getUserCached from "server/services/auth0-mgmt/getUserCached";
import _mapAuth0ToIdentity from "./_mapAuth0ToIdentity";

export default async <T extends string = string>(
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

      usermap[username] = _mapAuth0ToIdentity(result.value);
    }
  }

  return usermap;
};
