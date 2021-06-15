import { Request, Response, NextFunction } from "express";
import {
  BurstyRateLimiter,
  RateLimiterRes,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import SrkError from "src/classes/SrkError";
import createRedis from "src/services/redis";
import {
  POINTS,
  DURATION,
  BURST_POINTS,
  BURST_DURATION,
} from "src/config/rateLimiter";

const burstyLimiter = new BurstyRateLimiter(
  new RateLimiterRedis({
    storeClient: createRedis({
      keyPrefix: "rate-limit-normal:",
    }),
    points: POINTS,
    duration: DURATION,
  }),
  new RateLimiterRedis({
    storeClient: createRedis({
      keyPrefix: "rate-limit-burst:",
    }),
    points: BURST_POINTS,
    duration: BURST_DURATION,
  })
);

export default async (req: Request, res: Response, next: NextFunction) => {
  let result: RateLimiterRes;
  let doNext: boolean = true;
  try {
    result = await burstyLimiter.consume(req.ip);
  } catch (e) {
    result = e;
    doNext = false;
  }

  res.header("Retry-After", (result.msBeforeNext / 1000).toString());
  res.header("X-RateLimit-Limit", POINTS.toString());
  res.header("X-RateLimit-Remaining", result.remainingPoints.toString());
  res.header(
    "X-RateLimit-Reset",
    new Date(Date.now() + result.msBeforeNext).toUTCString()
  );

  if (doNext) {
    next();
  } else {
    next(new SrkError("rateLimited"));
  }
};
