import Redis, { RedisOptions } from "ioredis";

export default function (options?: RedisOptions) {
  return new Redis(process.env.REDIS_TLS_URL, {
    tls: {
      rejectUnauthorized: false,
    },
    ...options,
  });
}
