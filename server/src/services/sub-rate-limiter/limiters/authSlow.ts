import { RateLimiterRedis } from "rate-limiter-flexible";
import {
  AUTH_SLOW_SUBPREFIX,
  AUTH_SLOW_POINTS,
  AUTH_SLOW_DURATION,
  AUTH_SLOW_BLOCK_DURATION,
} from "server/config/rateLimiter";
import redisRl from "server/services/redis-rl";

export default new RateLimiterRedis({
  storeClient: redisRl,
  keyPrefix: AUTH_SLOW_SUBPREFIX,
  points: AUTH_SLOW_POINTS,
  duration: AUTH_SLOW_DURATION,
  blockDuration: AUTH_SLOW_BLOCK_DURATION,
});
