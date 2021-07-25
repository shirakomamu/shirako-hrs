import createRedis from "server/services/redis";
import { GENERAL_USAGE_PREFIX } from "server/config/redis";

export default createRedis({
  keyPrefix: GENERAL_USAGE_PREFIX,
});
