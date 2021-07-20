import { BusinessSearchDto } from "common/dto/items";
import { GEN_BUSINESS_SEARCH_PREFIX } from "server/config/redis";
import redisGu from "server/services/redis-gu";
import businessSearch, { BusinessSearchResponse } from "./businessSearch";

export default async ({ term, location }: BusinessSearchDto) => {
  const cached = await getCache({ term, location });
  if (cached) return cached;

  const response = await businessSearch({ term, location });
  await setCache({ term, location }, response);

  return response;
};

const getCacheKey = ({ term, location }: BusinessSearchDto) => {
  return GEN_BUSINESS_SEARCH_PREFIX + term + "//" + location;
};

const getCache = async ({ term, location }: BusinessSearchDto) => {
  const r = await redisGu.get(getCacheKey({ term, location }));
  if (!r) return null;
  return JSON.parse(r) as BusinessSearchResponse;
};

export const setCache = async (
  { term, location }: BusinessSearchDto,
  data: BusinessSearchResponse
) => {
  return await redisGu.set(
    getCacheKey({ term, location }),
    JSON.stringify(data),
    "ex",
    3600
  );
};

export const clearCache = async ({ term, location }: BusinessSearchDto) => {
  return await redisGu.del(getCacheKey({ term, location }));
};
