import { RATE_LIMITER_PREFIX } from "server/config/redis";
import createRedis from "server/services/redis";

export default createRedis({
  keyPrefix: RATE_LIMITER_PREFIX,
});
