import { RateLimiterRedis } from "rate-limiter-flexible";
import {
  AUTH_FAIL_SUBPREFIX,
  AUTH_FAIL_POINTS,
  AUTH_FAIL_DURATION,
  AUTH_FAIL_BLOCK_DURATION,
} from "src/config/rateLimiter";
import rateLimiterRedisClient from "src/services/rate-limiter-redis-client";

export default new RateLimiterRedis({
  storeClient: rateLimiterRedisClient,
  keyPrefix: AUTH_FAIL_SUBPREFIX,
  points: AUTH_FAIL_POINTS,
  duration: AUTH_FAIL_DURATION,
  blockDuration: AUTH_FAIL_BLOCK_DURATION,
});
