import { nanoid } from "nanoid";
import { compare, hash } from "server/services/bcrypt";
import { DI } from "server/middleware/initializeDi";
import { GEN_API_KEY_PREFIX } from "server/config/redis";
import redisGlobal from "server/services/redis-global";

const SECRET_SPLITTER = ".";

enum KeyValidity {
  "valid" = "valid",
  "invalid" = "invalid",
}

export const createKey = async (sub: string) => {
  const keySecret = nanoid(48);
  const hashedSecret = await hash(keySecret);

  return {
    secret: sub + SECRET_SPLITTER + keySecret,
    hash: hashedSecret,
  };
};

export const splitKey = (fullSecret: string) => {
  const splitSecret = fullSecret.split(SECRET_SPLITTER);

  if (splitSecret.length !== 2) {
    return null;
  }

  return {
    sub: splitSecret[0],
    secret: splitSecret[1],
  };
};

export const validateKey = async (fullSecret: string) => {
  const split = splitKey(fullSecret);
  if (!split) return false;

  const key = await DI.apiKeyRepo.findOne({
    owner: {
      sub: split.sub,
    },
  });

  if (!key) return false;

  return await compare(split.secret, key.key);
};

const getCacheKey = (fullSecret: string) => {
  return GEN_API_KEY_PREFIX + fullSecret;
};

const getCachedValue = async (fullSecret: string) => {
  const r = await redisGlobal.get(getCacheKey(fullSecret));
  if (!r) return null;
  return r as KeyValidity;
};

export const setCache = async (fullSecret: string, isValid: boolean) => {
  await redisGlobal.set(
    getCacheKey(fullSecret),
    isValid ? KeyValidity.valid : KeyValidity.invalid,
    "ex",
    600
  );

  return null;
};

export const clearCache = async (fullSecret: string) => {
  await redisGlobal.del(getCacheKey(fullSecret));

  return 0;
};

export const validateKeyCached = async (fullSecret: string) => {
  const cached = await getCachedValue(fullSecret);

  if (!cached) {
    const result = await validateKey(fullSecret);
    await setCache(fullSecret, result);
    return result;
  }

  return cached;
};
