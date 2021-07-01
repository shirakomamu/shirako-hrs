import Redis, { RedisOptions } from "ioredis";

export default (options?: RedisOptions) => {
  return new Redis(process.env.REDIS_TLS_URL, {
    tls: {
      rejectUnauthorized: false,
    },
    enableOfflineQueue: false,
    ...options,
  });
};
