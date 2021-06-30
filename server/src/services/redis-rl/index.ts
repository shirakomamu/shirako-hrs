import { RATE_LIMITER_PREFIX } from "src/config/redis";
import createRedis from "src/services/redis";

export default createRedis({
  keyPrefix: RATE_LIMITER_PREFIX,
});
