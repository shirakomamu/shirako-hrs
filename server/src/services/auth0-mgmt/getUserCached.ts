/* eslint-disable camelcase */
import { GENERAL_USAGE_PREFIX, GEN_USER_INFO_PREFIX } from "src/config/redis";
import guRedis from "src/services/gu-redis";
import getUser, { GetUserResponse } from "./getUser";

export default async (id: string): Promise<GetUserResponse> => {
  const cached = await getCache(id);
  if (cached) return cached;

  const response = await getUser(id);
  await setCache(id, response);

  return response;
};

const getCache = async (id: string) => {
  const r = await guRedis.get(GENERAL_USAGE_PREFIX + GEN_USER_INFO_PREFIX + id);
  if (!r) return null;
  return JSON.parse(r) as GetUserResponse;
};

export const setCache = async (id: string, data: GetUserResponse) => {
  return await guRedis.set(
    GENERAL_USAGE_PREFIX + GEN_USER_INFO_PREFIX + id,
    JSON.stringify(data),
    "ex",
    86400
  );
};

export const clearCache = async (id: string) => {
  return await guRedis.del(GENERAL_USAGE_PREFIX + GEN_USER_INFO_PREFIX + id);
};
