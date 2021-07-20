import Snowflake from "server/classes/Snowflake";
import {
  SNOWFLAKE_EPOCH,
  SNOWFLAKE_WORKER_ID,
  SNOWFLAKE_WORKER_BITS,
  SNOWFLAKE_PROCESS_BITS,
  SNOWFLAKE_INCREMENT_BITS,
} from "server/config/snowflake";

const worker = new Snowflake({
  epoch: SNOWFLAKE_EPOCH,
  workerId: SNOWFLAKE_WORKER_ID,
  processId: process.pid || undefined,
  workerBits: SNOWFLAKE_WORKER_BITS,
  processBits: SNOWFLAKE_PROCESS_BITS,
  incrementBits: SNOWFLAKE_INCREMENT_BITS,
});

export default worker;
