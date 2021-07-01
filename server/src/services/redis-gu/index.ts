import createRedis from "src/services/redis";
import { GENERAL_USAGE_PREFIX } from "src/config/redis";

export default createRedis({
  keyPrefix: GENERAL_USAGE_PREFIX,
});
