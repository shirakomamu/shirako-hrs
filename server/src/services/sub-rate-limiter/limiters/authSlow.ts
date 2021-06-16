import { RateLimiterRedis } from "rate-limiter-flexible";
import {
  AUTH_SLOW_SUBPREFIX,
  AUTH_SLOW_POINTS,
  AUTH_SLOW_DURATION,
  AUTH_SLOW_BLOCK_DURATION,
} from "src/config/rateLimiter";
import rateLimiterRedisClient from "src/services/rate-limiter-redis-client";

export default new RateLimiterRedis({
  storeClient: rateLimiterRedisClient,
  keyPrefix: AUTH_SLOW_SUBPREFIX,
  points: AUTH_SLOW_POINTS,
  duration: AUTH_SLOW_DURATION,
  blockDuration: AUTH_SLOW_BLOCK_DURATION,
});
