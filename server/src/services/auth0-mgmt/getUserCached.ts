import assert from "common/utils/assert";
import SrkError from "server/classes/SrkError";
import {
  GENERAL_USAGE_PREFIX,
  GEN_USER_INFO_ID_PREFIX,
  GEN_USER_INFO_USERNAME_PREFIX,
} from "server/config/redis";
import redisGu from "server/services/redis-gu";
import getUser, { GetUserResponse } from "./getUser";
import getUserByUsername from "./getUserByUsername";

export default async ({ id, username }: { id?: string; username?: string }) => {
  if (!id && !username) {
    throw new SrkError("resourceInvalid");
  }
  const cached = await getCache({ id, username });
  if (cached) return cached;

  // store cache by both id and username
  if (id) {
    const response = await getUser(id);
    await setCache({ id }, response);
    await setCache({ username: response.username }, response);

    return response;
  } else {
    assert<string>(username);
    const response = await getUserByUsername(username);
    await setCache({ id: response.user_id }, response);
    await setCache({ username }, response);

    return response;
  }
};

const getCacheKeyById = (id: string) => {
  return GENERAL_USAGE_PREFIX + GEN_USER_INFO_ID_PREFIX + id;
};

const getCacheKeyByUsername = (username: string) => {
  return GENERAL_USAGE_PREFIX + GEN_USER_INFO_USERNAME_PREFIX + username;
};

const getCache = async ({
  id,
  username,
}: {
  id?: string;
  username?: string;
}) => {
  if (!id && !username) {
    throw new SrkError("resourceInvalid");
  }
  let r: string | null = null;
  if (id) {
    r = await redisGu.get(getCacheKeyById(id));
  } else if (username) {
    r = await redisGu.get(getCacheKeyByUsername(username));
  } else {
    return null;
  }
  if (!r) return null;
  return JSON.parse(r) as GetUserResponse;
};

export const setCache = async (
  {
    id,
    username,
  }: {
    id?: string;
    username?: string;
  },
  data: GetUserResponse
) => {
  if (!id && !username) {
    throw new SrkError("resourceInvalid");
  }
  if (id) {
    return await redisGu.set(
      getCacheKeyById(id),
      JSON.stringify(data),
      "ex",
      3600
    );
  } else if (username) {
    return await redisGu.set(
      getCacheKeyByUsername(username),
      JSON.stringify(data),
      "ex",
      3600
    );
  } else {
    return null;
  }
};

export const clearCache = async ({
  id,
  username,
}: {
  id?: string;
  username?: string;
}) => {
  if (!id && !username) {
    throw new SrkError("resourceInvalid");
  }
  if (id) {
    return await redisGu.del(getCacheKeyById(id));
  } else if (username) {
    return await redisGu.del(getCacheKeyByUsername(username));
  } else {
    return 0;
  }
};
