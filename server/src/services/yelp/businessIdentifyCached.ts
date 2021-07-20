import { BusinessIdentifyDto } from "common/dto/items";
import { GEN_BUSINESS_IDENTIFY_PREFIX } from "server/config/redis";
import redisGu from "server/services/redis-gu";
import businessIdentify, { BusinessIdentifyResponse } from "./businessIdentify";

export default async ({ id }: BusinessIdentifyDto) => {
  const cached = await getCache({ id });
  if (cached) return cached;

  const response = await businessIdentify(id);
  await setCache(response.id, response);
  await setCache(response.alias, response);

  return response;
};

const getCacheKey = ({ id }: BusinessIdentifyDto) => {
  return GEN_BUSINESS_IDENTIFY_PREFIX + id;
};

const getCache = async ({ id }: BusinessIdentifyDto) => {
  const r = await redisGu.get(getCacheKey({ id }));
  if (!r) return null;
  return JSON.parse(r) as BusinessIdentifyResponse;
};

export const setCache = async (id: string, data: BusinessIdentifyResponse) => {
  return await redisGu.set(
    getCacheKey({ id }),
    JSON.stringify(data),
    "ex",
    3600
  );
};

export const clearCache = async ({ id }: BusinessIdentifyDto) => {
  return await redisGu.del(getCacheKey({ id }));
};
