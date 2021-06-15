import { hexToDec, convertBase } from "./utils";

const isString = (x: any): x is string => typeof x === "string";

export default class Snowflake {
  private epoch: number;
  private workerId?: number;
  private processId?: number;
  private workerBits: number;
  private processBits: number;
  private incrementBits: number;

  private seq: number;
  private lastTime: number;

  private binaryWorkerId: string;
  private binaryProcessId: string;

  constructor({
    epoch = 0,
    workerId = 1,
    processId,
    workerBits = 10,
    processBits = 0,
    incrementBits = 12,
  }: {
    epoch?: number;
    workerId?: number;
    processId?: number;
    workerBits?: number;
    processBits?: number;
    incrementBits?: number;
  } = {}) {
    if (workerBits + processBits + incrementBits !== 22) {
      throw new Error("Worker, process, and increment must be 22 bits");
    }
    this.epoch = epoch;
    this.workerId = (workerId && workerId % (2 ** workerBits - 1)) || undefined;
    this.processId =
      (processId && processId % (2 ** processBits - 1)) || undefined;
    this.workerBits = workerBits;
    this.processBits = processBits;
    this.incrementBits = incrementBits;

    this.seq = 0;
    this.lastTime = 0;

    this.binaryWorkerId = this.workerId
      ? this.workerId.toString(2).padStart(workerBits, "0")
      : "";
    this.binaryProcessId = this.processId
      ? this.processId.toString(2).padStart(processBits, "0")
      : "";
  }

  generate() {
    const time = Date.now();
    const bTime = (time - this.epoch).toString(2);

    // get the sequence number
    if (this.lastTime === time) {
      this.seq++;

      if (this.seq > 4095) {
        this.seq = 0;

        // make system wait till time is been shifted by one millisecond
        while (Date.now() <= time) {
          // do nothing
        }
      }
    } else {
      this.seq = 0;
    }

    this.lastTime = time;

    const bSeq = this.seq.toString(2).padStart(this.incrementBits, "0");
    const bid = bTime + this.binaryWorkerId + this.binaryProcessId + bSeq;

    let hex = "";
    for (let i = bid.length; i > 0; i -= 4) {
      const thisHex = parseInt(bid.substring(i - 4, i), 2).toString(16);
      hex = thisHex + hex;
    }

    const dec = hexToDec(hex);

    return dec;
  }

  deconstruct(snowflake: string | BigInt) {
    let snString: string;
    if (typeof snowflake === "bigint") {
      snString = snowflake.toString();
    } else if (isString(snowflake)) {
      snString = snowflake;
    } else {
      throw new Error("Snowflake must be string or bigint");
    }
    const hex = convertBase(snString, 10, 16);

    let bid = "";
    for (let i = hex.length; i > 0; i--) {
      const thisDec = parseInt(hex.substring(i - 1, i), 16)
        .toString(2)
        .padStart(4, "0");
      bid = thisDec + bid;
    }

    const seqStartPoint = bid.length - this.incrementBits;
    const processStartPoint = seqStartPoint - this.processBits;
    const workerStartPoint = processStartPoint - this.workerBits;

    const bTime = bid.substring(0, workerStartPoint);
    const binaryWorkerId = bid.substring(workerStartPoint, processStartPoint);
    const binaryProcessId = bid.substring(processStartPoint, seqStartPoint);
    const bSeq = bid.substring(seqStartPoint, bid.length);

    const timestamp = parseInt(bTime, 2) + this.epoch;
    const workerId = parseInt(binaryWorkerId, 2) || undefined;
    const processId = parseInt(binaryProcessId, 2) || undefined;
    const increment = parseInt(bSeq, 2);

    const deconstructed = {
      snowflake,
      timestamp,
      workerId,
      processId,
      increment,
    };

    return deconstructed;
  }
}
